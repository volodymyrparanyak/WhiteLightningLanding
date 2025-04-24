"use client";

import React, {useState, useRef, useEffect} from "react";
import * as ort from "onnxruntime-web";
import {
    Container,
    Box,
    Typography,
    Select,
    MenuItem,
    Button,
    TextField,
    Paper,
    FormControl,
    InputLabel,
    useTheme,
    useMediaQuery,
    Tooltip,
    CircularProgress,
    Chip,
} from "@mui/material";
import {
    UploadFile,
    MemoryOutlined,
    CategoryOutlined,
    SchemaOutlined,
    SendRounded,
    ExploreRounded,
} from "@mui/icons-material";
import {loadBinaryArtifacts, runBinaryInference} from "@/app/utils/binary-runtime";
import {loadMulticlassArtifacts, runMulticlassInference} from "@/app/utils/multiclass-runtime";

interface ChatMessage {
    text: string;
    isUser: boolean;
}

interface PreprocessingData {
    vocabulary: { [word: string]: number };
    idf: number[] | null;
    mean: number[];
    scale: number[];
    max_features: number;
}

interface IModel {
    name: string;
    type: string;
    prefix: string;
    subClasses: string[];
    subClassLabel?: string;
}

enum ModelType {
    BINARY = "binary_classifier",
    MULTICLASS = "multiclass_classifier",
}

const BINARY_MODELS: IModel[] = [
    {
        name: "Spam Classifier",
        type: ModelType.BINARY,
        prefix: "spam_classifier",
        subClasses: [],
    },
    {
        name: "Leading Questions",
        type: ModelType.BINARY,
        prefix: "leading_questions",
        subClasses: [],
    },
    {
        name: "Clickbait News Titles",
        type: ModelType.BINARY,
        prefix: "clickbait_news",
        subClasses: [],
    },
    {
        name: "Toxic Words",
        type: ModelType.BINARY,
        prefix: "toxic_words",
        subClasses: [],
    },
    {
        name: "Sentiment sentences",
        type: ModelType.BINARY,
        prefix: "sentiment_sentences",
        subClasses: [],
    },
    {
        name: 'Pirate Speech',
        type: ModelType.BINARY,
        prefix: 'pirate_speech',
        subClasses: [],
    },
    {
        name: 'SMS Urgency Detector',
        type: ModelType.BINARY,
        prefix: 'sms_urgency',
        subClasses: [],
    },
    {
        name: 'Sarcasm Detector',
        type: ModelType.BINARY,
        prefix: 'sarcasm_detector',
        subClasses: [],
    },
];

const MULTICLASS_MODELS: IModel[] = [
    {
        name: "News Classifier",
        type: ModelType.MULTICLASS,
        prefix: "news_classifier",
        subClasses: ["Arabic", "Chinese", "Deutch", "English", "French", "Italian", "Japanese", "Russian", "Spain"],
        subClassLabel: "Language",
    },
    {
        name: "Hate Speech Classifier",
        type: ModelType.MULTICLASS,
        prefix: "hate_speech",
        subClasses: [  "Deutch", "English", "French", "Italian", "Ukrainian", "Russian", "Spanish"],
        subClassLabel: "Language",
    },
];

export default function ChatPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<IModel | null>(null);
    const [artifacts, setArtifacts] = useState<any>(null);
    const [selectedModelType, setSelectedModelType] = useState<string | null>(null);
    const [selectedModelSubclass, setSelectedModelSubclass] = useState<string | null>(null);
    const [session, setSession] = useState<ort.InferenceSession | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleSelectModel = (name: string) => {
        const model = getModelsList().find((m) => m.name === name);
        setSelectedModel(model!);
    };

    const handleSelectModelType = (value: string) => {
        setSelectedModelType(value);
    };

    const handleSelectModelSubclass = (value: string) => {
        setSelectedModelSubclass(value);
    };

    const getModelsList = () => {
        if (selectedModelType === ModelType.BINARY) {
            return BINARY_MODELS;
        } else if (selectedModelType === ModelType.MULTICLASS) {
            return MULTICLASS_MODELS;
        }
        return [];
    };

    // Load model and preprocessing data
    useEffect(() => {
        const loadResources = async () => {
            if (selectedModel) {
                if (selectedModel.subClasses.length > 0 && !selectedModelSubclass) {
                    return;
                }
                setIsLoading(true);
                try {
                    setMessages((prev) => [
                        ...prev,
                        {text: `Loading model: ${selectedModel.name}...`, isUser: false},
                    ]);

                    // Construct model path
                    const modelPathPrefix = `models/${selectedModel.type}/${selectedModel.prefix}${
                        selectedModel.subClasses.length && selectedModelSubclass ? `(${selectedModelSubclass})` : ''
                    }`;

                    // Load ONNX model
                    const inferenceSession = await ort.InferenceSession.create(`${modelPathPrefix}/model.onnx`);
                    setSession(inferenceSession);

                    // Load artifacts based on model type
                    const loadedArtifacts =
                        selectedModel.type === ModelType.BINARY
                            ? await loadBinaryArtifacts(modelPathPrefix)
                            : await loadMulticlassArtifacts(modelPathPrefix);
                    setArtifacts(loadedArtifacts);

                    setMessages((prev) => [
                        ...prev,
                        {text: `Model loaded successfully! You can now start classifying text.`, isUser: false},
                    ]);
                } catch (error) {
                    console.error('Error loading resources:', error);
                    setMessages((prev) => [
                        ...prev,
                        {text: `Error: ${(error as Error).message}`, isUser: false},
                    ]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadResources();
    }, [selectedModel, selectedModelSubclass]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const processInput = async (text: string): Promise<void> => {
        if (!session || !selectedModel || !artifacts) {
            setMessages((prev) => [
                ...prev,
                {text: 'Please select a model first', isUser: false},
            ]);
            return;
        }

        setIsProcessing(true);
        try {
            setMessages((prev) => [
                ...prev,
                {text: 'Processing input, please wait...', isUser: false},
            ]);

            // Run inference based on model type
            const result =
                selectedModel.type === ModelType.BINARY
                    ? await runBinaryInference(session, text, artifacts)
                    : await runMulticlassInference(session, text, artifacts);

            // Remove processing message and add result
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages.pop(); // Remove processing message
                newMessages.push({
                    text: `Classification: ${result.label} (Score: ${result.probability.toFixed(4)})`,
                    isUser: false,
                });
                return newMessages;
            });
        } catch (error) {
            setMessages((prev) => {
                const newMessages = [...prev];
                if (
                    newMessages.length > 0 &&
                    newMessages[newMessages.length - 1].text === 'Processing input, please wait...'
                ) {
                    newMessages.pop();
                }
                newMessages.push({
                    text: `Error processing input: ${(error as Error).message}`,
                    isUser: false,
                });
                return newMessages;
            });
        } finally {
            setIsProcessing(false);
        }
    };

    console.log(!!selectedModel && selectedModel?.subClasses.length > 0)
    // @ts-ignore
    console.log(selectedModel?.subClasses.length > 0)
    console.log(!!selectedModel)

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setMessages((prev) => [...prev, {text: inputText, isUser: true}]);
        void processInput(inputText);
        setInputText("");
    };

    const handleUpload = () => {
        // Placeholder for upload functionality
        setMessages((prev) => [
            ...prev,
            {
                text: "Custom model upload functionality coming soon!",
                isUser: false,
            },
        ]);
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: {xs: 2, md: 4},
                px: {xs: 1, md: 3},
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontFamily: "var(--font-nunito)",
                        fontWeight: 700,
                        textAlign: {xs: "center", sm: "left"},
                    }}
                    className="gradient-text"
                >
                    Model Playground
                </Typography>

                {(isLoading || isProcessing) && (
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        <CircularProgress size={20} color="primary"/>
                        <Typography variant="body2" color="text.secondary">
                            {isLoading ? "Loading model..." : "Processing..."}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    position: "relative",
                    boxShadow:
                        "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                }}
                className="feature-card"
            >
                {/* Control Panel at the top */}
                <Box
                    sx={{
                        p: 2.5,
                        borderBottom: 1,
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "stretch" : "center",
                        gap: 2,
                        background:
                            "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))",
                    }}
                >
                    <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                        <Tooltip
                            title="Select model type"
                            arrow
                            placement="top"
                        >
                            <FormControl
                                size="small"
                                sx={{width: isMobile ? "100%" : "250px"}}
                            >
                                <InputLabel id="model-type-select-label">
                                    <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                        <CategoryOutlined fontSize="small"/>
                                        Select Model Type
                                    </Box>
                                </InputLabel>
                                <Select
                                    labelId="model-type-select-label"
                                    value={selectedModelType}
                                    label={
                                        <Box
                                            sx={{display: "flex", alignItems: "center", gap: 0.5}}
                                        >
                                            <CategoryOutlined fontSize="small"/>
                                            Select Model Type
                                        </Box>
                                    }
                                    onChange={(e) => handleSelectModelType(e.target.value as string)}
                                    sx={{
                                        bgcolor: "rgba(255, 255, 255, 0.7)",
                                        borderRadius: "8px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(59, 130, 246, 0.2)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(59, 130, 246, 0.4)",
                                        },
                                    }}
                                    disabled={isLoading}
                                >
                                    <MenuItem value="">
                                        <em>Choose model type</em>
                                    </MenuItem>
                                    <MenuItem key={ModelType.BINARY} value={ModelType.BINARY}>
                                        <Box
                                            sx={{display: "flex", alignItems: "center", gap: 1}}
                                        >
                                            <SchemaOutlined fontSize="small" color="primary"/>
                                            Binary Classifier
                                        </Box>
                                    </MenuItem>
                                    <MenuItem key={ModelType.MULTICLASS} value={ModelType.MULTICLASS}>
                                        <Box
                                            sx={{display: "flex", alignItems: "center", gap: 1}}
                                        >
                                            <SchemaOutlined fontSize="small" color="primary"/>
                                            Multiclass Classifier
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Tooltip>

                        {!!selectedModelType && <Tooltip
                            title="Select a model"
                            arrow
                            placement="top"
                        >
                            <FormControl
                                size="small"
                                sx={{width: isMobile ? "100%" : "250px"}}
                            >
                                <InputLabel id="model-select-label">
                                    <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                        <CategoryOutlined fontSize="small"/>
                                        Select Model
                                    </Box>
                                </InputLabel>
                                <Select
                                    labelId="model-select-label"
                                    value={selectedModel?.name}
                                    label={
                                        <Box
                                            sx={{display: "flex", alignItems: "center", gap: 0.5}}
                                        >
                                            <CategoryOutlined fontSize="small"/>
                                            Select Model
                                        </Box>
                                    }
                                    onChange={(e) => handleSelectModel(e.target.value as string)}
                                    sx={{
                                        bgcolor: "rgba(255, 255, 255, 0.7)",
                                        borderRadius: "8px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(59, 130, 246, 0.2)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(59, 130, 246, 0.4)",
                                        },
                                    }}
                                    disabled={isLoading}
                                >
                                    <MenuItem value="">
                                        <em>Choose a model</em>
                                    </MenuItem>
                                    {getModelsList().map((model) => (
                                        <MenuItem key={model.name} value={model.name}>
                                            <Box
                                                sx={{display: "flex", alignItems: "center", gap: 1}}
                                            >
                                                <SchemaOutlined fontSize="small" color="primary"/>
                                                {model.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>
                        }

                        {(!!selectedModel && selectedModel?.subClasses.length > 0) && <Tooltip
                            title={`Select Model ${selectedModel?.subClassLabel}`}
                            arrow
                            placement="top"
                        >
                            <FormControl
                                size="small"
                                sx={{width: isMobile ? "100%" : "250px"}}
                            >
                                <InputLabel id="model-select-subclass">
                                    <Box sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                        <CategoryOutlined fontSize="small"/>
                                        Select Model {selectedModel?.subClassLabel}
                                    </Box>
                                </InputLabel>
                                <Select
                                    labelId="model-select-subclass"
                                    value={selectedModelSubclass}
                                    label={
                                        <Box
                                            sx={{display: "flex", alignItems: "center", gap: 0.5}}
                                        >
                                            <CategoryOutlined fontSize="small"/>
                                            Select Model {selectedModel?.subClassLabel}
                                        </Box>
                                    }
                                    onChange={(e) => handleSelectModelSubclass(e.target.value as string)}
                                    sx={{
                                        bgcolor: "rgba(255, 255, 255, 0.7)",
                                        borderRadius: "8px",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(59, 130, 246, 0.2)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(59, 130, 246, 0.4)",
                                        },
                                    }}
                                    disabled={isLoading}
                                >
                                    <MenuItem value="">
                                        <em>Choose a model {selectedModel?.subClassLabel}</em>
                                    </MenuItem>
                                    {selectedModel.subClasses.map((model) => (
                                        <MenuItem key={model} value={model}>
                                            <Box
                                                sx={{display: "flex", alignItems: "center", gap: 1}}
                                            >
                                                <SchemaOutlined fontSize="small" color="primary"/>
                                                {model}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Tooltip>}

                        {session && (
                            <Chip
                                icon={<MemoryOutlined fontSize="small"/>}
                                label="Model loaded"
                                color="success"
                                size="small"
                                sx={{fontFamily: "var(--font-inter)"}}
                            />
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<UploadFile/>}
                        onClick={handleUpload}
                        sx={{
                            height: isMobile ? "auto" : "40px",
                            whiteSpace: "nowrap",
                            borderRadius: "8px",
                            borderWidth: "1.5px",
                            fontFamily: "var(--font-poppins)",
                            fontWeight: 500,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                borderWidth: "1.5px",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(59, 130, 246, 0.2)",
                            },
                        }}
                        disabled={isLoading}
                    >
                        Upload Custom
                    </Button>
                </Box>

                {/* Chat Container */}
                <Box
                    ref={chatContainerRef}
                    sx={{
                        flex: 1,
                        overflow: "auto",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
                        backgroundAttachment: "fixed",
                    }}
                >
                    {messages.length === 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                gap: 2,
                            }}
                        >
                            <ExploreRounded
                                sx={{fontSize: 40, color: "primary.main", opacity: 0.7}}
                            />
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                align="center"
                                sx={{fontFamily: "var(--font-nunito)", fontWeight: 600}}
                            >
                                Welcome to the Playground
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                align="center"
                                sx={{maxWidth: "400px"}}
                            >
                                Select a model above and start classifying text. Enter your
                                message in the box below to see how the model classifies it.
                            </Typography>
                        </Box>
                    )}

                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                alignSelf: message.isUser ? "flex-end" : "flex-start",
                                maxWidth: {xs: "90%", sm: "75%"},
                                mb: 2,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: message.isUser ? "row-reverse" : "row",
                                    alignItems: "flex-end",
                                    mb: 0.5,
                                    gap: 1,
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2.5,
                                        bgcolor: message.isUser
                                            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                            : "background.paper",
                                        backgroundImage: message.isUser
                                            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                                            : "none",
                                        color: message.isUser ? "#fff" : "text.primary",
                                        wordBreak: "break-word",
                                        boxShadow: message.isUser
                                            ? "0 2px 5px rgba(37, 99, 235, 0.2)"
                                            : "0 2px 5px rgba(0, 0, 0, 0.05)",
                                        position: "relative",
                                        "&::before": message.isUser
                                            ? {
                                                content: '""',
                                                position: "absolute",
                                                bottom: 8,
                                                right: -6,
                                                width: 12,
                                                height: 12,
                                                background:
                                                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                                transform: "rotate(45deg)",
                                                borderRadius: 1,
                                                zIndex: -1,
                                            }
                                            : {
                                                content: '""',
                                                position: "absolute",
                                                bottom: 8,
                                                left: -6,
                                                width: 12,
                                                height: 12,
                                                backgroundColor: "background.paper",
                                                transform: "rotate(45deg)",
                                                borderRadius: 1,
                                                zIndex: -1,
                                            },
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{fontFamily: "var(--font-inter)"}}
                                    >
                                        {message.text}
                                    </Typography>
                                </Paper>
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    alignSelf: message.isUser ? "flex-end" : "flex-start",
                                    px: 1,
                                    opacity: 0.7,
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.7rem",
                                }}
                            >
                                {message.isUser ? "You" : "AI Assistant"}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 2.5,
                        borderTop: 1,
                        borderColor: "divider",
                        display: "flex",
                        gap: 1.5,
                        background:
                            "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))",
                    }}
                >
                    <TextField
                        fullWidth
                        size="medium"
                        variant="outlined"
                        placeholder={
                            session
                                ? "Enter text to classify..."
                                : "Please select a model first"
                        }
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={!session || isLoading || isProcessing}
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                fontFamily: "var(--font-inter)",
                                "& fieldset": {
                                    borderColor: "rgba(59, 130, 246, 0.2)",
                                    borderWidth: "1px",
                                },
                                "&:hover fieldset": {
                                    borderColor: "rgba(59, 130, 246, 0.4)",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "rgba(59, 130, 246, 0.6)",
                                    borderWidth: "2px",
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                            !session || isLoading || isProcessing || !inputText.trim()
                        }
                        disableElevation
                        endIcon={
                            isProcessing ? (
                                <CircularProgress size={16} color="inherit"/>
                            ) : (
                                <SendRounded/>
                            )
                        }
                        sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: "8px",
                            fontFamily: "var(--font-poppins)",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            transition: "all 0.3s ease",
                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                            },
                        }}
                    >
                        {isProcessing ? "Processing..." : "Classify"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

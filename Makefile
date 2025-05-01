setup-husky:
	echo "Installing Husky pre-commit hook..."
	npx husky init
	echo '#!/usr/bin/env sh\n. "$(dirname -- "$$0")/_/husky.sh"\nnpm run format' > .husky/pre-commit
	chmod +x .husky/pre-commit
	echo "Husky setup complete!"
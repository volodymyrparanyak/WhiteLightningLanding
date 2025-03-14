import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Binary Classifier
          </Link>
          
          <div className="flex space-x-8">
            <Link
              href="/docs"
              className={clsx(
                'hover:text-blue-600 transition-colors',
                pathname.startsWith('/docs') ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              Documentation
            </Link>
            <Link
              href="/playground"
              className={clsx(
                'hover:text-blue-600 transition-colors',
                pathname.startsWith('/playground') ? 'text-blue-600' : 'text-gray-600'
              )}
            >
              Playground
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

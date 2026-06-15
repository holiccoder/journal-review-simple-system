export default function SiteFooter() {
    return (
        <footer className="w-full border-t border-gray-200 px-6 py-4 dark:border-gray-800 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
                <a
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground hover:underline"
                >
                    苏ICP备2026038509号-1
                </a>
            </p>
        </footer>
    );
}

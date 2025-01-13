import { Link } from "react-router-dom"
import { useTheme } from "../context/theme-provider"
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark"
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-blur]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/">
          <img
            className="h-14"
            src={isDark ? "/public/logo.png" : "/public/logo2.png"}
            alt="Weather V2" />
        </Link>

        <div>
          <div
            className={`flex items-center cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "rotate-0"}`}
            onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? (
              <Sun className="size-7 text-yellow-500 rotate-0 transition-all" />
            ) : <Moon className="size-7 text-blue-500 rotate-0 transition-all" />}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

import Link from "next/link";
import { Github, Twitch, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          More from Newo
        </h3>
        <div className="flex space-x-4">
          <Link
            href="https://twitter.com/kneewoah"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
          </Link>
          <Link
            href="https://github.com/owens1127/destiny-wrapped"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
          </Link>
          <Link
            href="https://www.youtube.com/@newo1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <Youtube className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-00 transition-colors" />
          </Link>
          <Link
            href="https://www.twitch.tv/newoX"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitch"
          >
            <Twitch className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-00 transition-colors" />
          </Link>
          <a href="https://ko-fi.com/T6T117OK7S" target="_blank">
            <Image
              width={580}
              height={146}
              className="border-0 max-w-32"
              src="https://storage.ko-fi.com/cdn/kofi5.png?v=6"
              alt="Buy Me a Coffee at ko-fi.com"
              unoptimized
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-industrial",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f1ec",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.locale}
      className={`${anton.variable} ${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint. The curtain is server-rendered so it is
            already on screen at paint; this decides, synchronously, whether the
            visitor should be seeing it at all. Keep the rules in step with
            lib/intro-state.ts. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
var t=localStorage.getItem('giants:theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light';
var p=new URLSearchParams(location.search),play;
if(p.has('nointro'))play=false;
else if(p.has('intro'))play=true;
else if(matchMedia('(prefers-reduced-motion: reduce)').matches)play=false;
else play=sessionStorage.getItem('giants:intro')!=='1';
document.documentElement.dataset.intro=play?'play':'skip';
}catch(e){document.documentElement.dataset.intro='play';}})();`,
          }}
        />
      </head>
      <body className="bg-void text-bone antialiased">{children}</body>
    </html>
  );
}

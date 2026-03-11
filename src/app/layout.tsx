import "./globals.css";
import { Roboto } from "next/font/google";
import Providers from "../store/Providers";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <Providers>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                background: "#fff",
              }}
            >
              <header
                style={{
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "0 28px",
                  borderBottom: "1px solid #e7ecef",
                  background: "#fff",
                  position: "sticky",
                  top: 0,
                  zIndex: 20,
                }}
              >
                <div style={{ width: "100%", maxWidth: "420px" }}>
                  <SearchBar />
                </div>
              </header>

              <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

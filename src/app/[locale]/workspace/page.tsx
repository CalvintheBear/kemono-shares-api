import Workspace from "@/components/Workspace";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function WorkspacePage() {
  const t = await getTranslations("workspace");
  const messages = (await import("../../../../messages/ja.json")).default; // 仅使用日语

  return (
    <div className="min-h-screen bg-[#fff7ea]">
      {/* 顶部导航栏 */}
      <Header />

      {/* 页面主体，顶部预留导航栏高度 */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-scale-in">
            <h1 className="text-5xl font-bold text-gradient mb-6 font-cute float">
              {t("title")}
            </h1>
            <p className="text-gray-700 text-xl font-medium max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Workspace */}
          <NextIntlClientProvider locale="ja" messages={messages}>
            <Workspace />
          </NextIntlClientProvider>
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
} 
"use client";

import { useState } from "react";

export default function PRPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "リアルタイム位置情報記録",
      description: "GPSによる正確な出退勤位置の記録で、信頼性の高い勤怠管理を実現",
      icon: <LocationPinSVG />
    },
    {
      title: "美しいグラスマーフィズムUI",
      description: "モダンで直感的なインターフェースで、ストレスのない操作体験を提供",
      icon: <DesignSVG />
    },
    {
      title: "Excel出力機能",
      description: "ワンクリックで勤怠データをExcel形式で出力、給与計算や報告書作成が容易",
      icon: <ExcelSVG />
    },
    {
      title: "管理者向けダッシュボード",
      description: "全従業員の勤怠状況を一覧で確認できる包括的な管理画面",
      icon: <DashboardSVG />
    }
  ];

  const testimonials = [
    {
      name: "山田 太郎",
      position: "人事部長",
      company: "LSI株式会社",
      comment: "導入後、勤怠管理の工数が70%削減されました。特に位置情報記録機能で不正打刻がなくなり、信頼性が大幅に向上しました。",
      avatar: <Avatar1SVG />
    },
    {
      name: "佐藤 美咲",
      position: "総務課長",
      company: "LSI株式会社",
      comment: "UIが非常に使いやすく、従業員からの評判も良好です。Excel出力機能で月末の業務効率が格段に向上しました。",
      avatar: <Avatar2SVG />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ClockSVG className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">LSI勤怠システム</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">特徴</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">導入事例</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">お問い合わせ</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                次世代の
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  勤怠管理
                </span>
                システム
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                LSI勤怠システムは、GPS位置情報と美しいUIで<br />
                従業員の勤怠管理を革新します。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  デモを試す
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  資料ダウンロード
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <HeroDashboardSVG />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 transform -rotate-6">
                <MobileAppSVG />
              </div>
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 transform rotate-6">
                <AnalyticsSVG />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              主な<span className="text-blue-600">特徴</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              モダンな技術と使いやすさを兼ね備えた、次世代勤怠管理システム
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              美しい<span className="text-purple-600">インターフェース</span>
            </h2>
            <p className="text-xl text-gray-600">
              グラスマーフィズムデザインによる、モダンで直感的な操作体験
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  管理者ダッシュボード
                </h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <CheckCircleSVG className="w-6 h-6 text-green-500" />
                    <span>全従業員の勤怠状況を一覧表示</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircleSVG className="w-6 h-6 text-green-500" />
                    <span>GPS位置情報による打刻確認</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircleSVG className="w-6 h-6 text-green-500" />
                    <span>Excel形式でのデータ出力</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircleSVG className="w-6 h-6 text-green-500" />
                    <span>月次・年次のレポート生成</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-6">
                <DashboardPreviewSVG />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              導入<span className="text-blue-600">事例</span>
            </h2>
            <p className="text-xl text-gray-600">
              実際の導入企業様からの声
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.position}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">
                  「{testimonial.comment}」
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            今すぐ勤怠管理を革新しましょう
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            無料デモンストレーションで、その使いやすさを実感してください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              お問い合わせ
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
              資料請求
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <ClockSVG className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">LSI勤怠システム</span>
              </div>
              <p className="text-gray-400">
                次世代の勤怠管理で、業務効率を革新します。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">製品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">特徴</a></li>
                <li><a href="#" className="hover:text-white transition-colors">価格</a></li>
                <li><a href="#" className="hover:text-white transition-colors">導入事例</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">ヘルプセンター</a></li>
                <li><a href="#" className="hover:text-white transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">会社情報</h4>
              <ul className="space-y-2 text-gray-400">
                <li>LSI株式会社</li>
                <li>〒100-0000 東京都千代田区</li>
                <li>Tel: 03-1234-5678</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LSI株式会社. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// SVG Components
function ClockSVG({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LocationPinSVG() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function DesignSVG() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}

function ExcelSVG() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function DashboardSVG() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CheckCircleSVG({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function HeroDashboardSVG() {
  return (
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
      {/* Dashboard Background */}
      <rect width="400" height="300" rx="16" fill="url(#dashboardGradient)"/>
      
      {/* Header */}
      <rect x="20" y="20" width="360" height="40" rx="8" fill="white" fillOpacity="0.9"/>
      <rect x="30" y="30" width="120" height="20" rx="4" fill="#3B82F6"/>
      <rect x="280" y="30" width="90" height="20" rx="4" fill="#8B5CF6"/>
      
      {/* Stats Cards */}
      <rect x="20" y="80" width="110" height="80" rx="8" fill="white" fillOpacity="0.9"/>
      <rect x="30" y="90" width="40" height="40" rx="8" fill="#3B82F6" fillOpacity="0.2"/>
      <rect x="80" y="90" width="40" height="20" rx="4" fill="#6B7280" fillOpacity="0.3"/>
      <rect x="80" y="115" width="40" height="10" rx="2" fill="#3B82F6"/>
      
      <rect x="145" y="80" width="110" height="80" rx="8" fill="white" fillOpacity="0.9"/>
      <rect x="155" y="90" width="40" height="40" rx="8" fill="#8B5CF6" fillOpacity="0.2"/>
      <rect x="205" y="90" width="40" height="20" rx="4" fill="#6B7280" fillOpacity="0.3"/>
      <rect x="205" y="115" width="40" height="10" rx="2" fill="#8B5CF6"/>
      
      <rect x="270" y="80" width="110" height="80" rx="8" fill="white" fillOpacity="0.9"/>
      <rect x="280" y="90" width="40" height="40" rx="8" fill="#10B981" fillOpacity="0.2"/>
      <rect x="330" y="90" width="40" height="20" rx="4" fill="#6B7280" fillOpacity="0.3"/>
      <rect x="330" y="115" width="40" height="10" rx="2" fill="#10B981"/>
      
      {/* Table */}
      <rect x="20" y="180" width="360" height="100" rx="8" fill="white" fillOpacity="0.9"/>
      <rect x="30" y="195" width="340" height="2" rx="1" fill="#E5E7EB"/>
      <rect x="30" y="215" width="340" height="2" rx="1" fill="#F3F4F6"/>
      <rect x="30" y="235" width="340" height="2" rx="1" fill="#F3F4F6"/>
      <rect x="30" y="255" width="340" height="2" rx="1" fill="#F3F4F6"/>
      
      <defs>
        <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF"/>
          <stop offset="100%" stopColor="#F3E8FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function MobileAppSVG() {
  return (
    <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
      <rect width="120" height="160" rx="20" fill="white"/>
      <rect x="10" y="10" width="100" height="140" rx="12" fill="#F3F4F6"/>
      <rect x="20" y="20" width="80" height="25" rx="6" fill="#3B82F6"/>
      <rect x="20" y="55" width="80" height="8" rx="4" fill="#9CA3AF"/>
      <rect x="20" y="70" width="60" height="8" rx="4" fill="#D1D5DB"/>
      <rect x="20" y="90" width="80" height="40" rx="8" fill="#8B5CF6" fillOpacity="0.1"/>
      <rect x="30" y="100" width="20" height="20" rx="4" fill="#8B5CF6"/>
      <rect x="60" y="100" width="30" height="8" rx="4" fill="#8B5CF6"/>
      <rect x="60" y="112" width="20" height="6" rx="3" fill="#9CA3AF"/>
    </svg>
  );
}

function AnalyticsSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect width="120" height="120" rx="16" fill="white"/>
      <rect x="10" y="10" width="100" height="100" rx="8" fill="#F3F4F6"/>
      {/* Chart Line */}
      <path d="M20 80 L40 60 L60 70 L80 40 L100 50" stroke="#3B82F6" strokeWidth="3" fill="none"/>
      {/* Chart Dots */}
      <circle cx="20" cy="80" r="3" fill="#3B82F6"/>
      <circle cx="40" cy="60" r="3" fill="#3B82F6"/>
      <circle cx="60" cy="70" r="3" fill="#3B82F6"/>
      <circle cx="80" cy="40" r="3" fill="#3B82F6"/>
      <circle cx="100" cy="50" r="3" fill="#3B82F6"/>
    </svg>
  );
}

function DashboardPreviewSVG() {
  return (
    <svg width="400" height="250" viewBox="0 0 400 250" fill="none">
      <rect width="400" height="250" rx="12" fill="url(#previewGradient)"/>
      
      {/* Glass Header */}
      <rect x="20" y="20" width="360" height="50" rx="8" fill="white" fillOpacity="0.9"/>
      <rect x="30" y="30" width="150" height="30" rx="6" fill="#3B82F6" fillOpacity="0.8"/>
      
      {/* Stats Row */}
      <rect x="20" y="90" width="360" height="60" rx="8" fill="white" fillOpacity="0.8"/>
      <rect x="30" y="100" width="40" height="40" rx="8" fill="#3B82F6" fillOpacity="0.2"/>
      <rect x="120" y="100" width="40" height="40" rx="8" fill="#8B5CF6" fillOpacity="0.2"/>
      <rect x="210" y="100" width="40" height="40" rx="8" fill="#10B981" fillOpacity="0.2"/>
      <rect x="300" y="100" width="40" height="40" rx="8" fill="#F59E0B" fillOpacity="0.2"/>
      
      <defs>
        <linearGradient id="previewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF"/>
          <stop offset="100%" stopColor="#F3E8FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function Avatar1SVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#3B82F6"/>
      <circle cx="20" cy="15" r="6" fill="#E5E7EB"/>
      <path d="M8 32 C8 26, 32 26, 32 32 L32 36 L8 36 Z" fill="#E5E7EB"/>
    </svg>
  );
}

function Avatar2SVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#8B5CF6"/>
      <circle cx="20" cy="15" r="6" fill="#E5E7EB"/>
      <path d="M8 32 C8 26, 32 26, 32 32 L32 36 L8 36 Z" fill="#E5E7EB"/>
    </svg>
  );
}
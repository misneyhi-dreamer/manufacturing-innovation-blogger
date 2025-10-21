
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Helper Components (Defined outside App) ---

const SpinnerIcon: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Header: React.FC = () => (
  <header className="bg-white shadow-md">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">제조 혁신 멘토 TK</h1>
          </div>
        </div>
      </div>
    </div>
  </header>
);

interface ResponseDisplayProps {
  content: string;
}
const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ content }) => {
  const lines = content.trim().split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return null;

  const title = lines[0];
  const subtitle = lines.length > 1 && !lines[1].startsWith('홈페이지:') ? lines[1] : null;
  let bodyStartIndex = subtitle ? 2 : 1;
  // Handle cases where there might not be a subtitle.
  if (lines.length > 1 && (lines[1].startsWith('사장님') || lines[1].startsWith('대표님'))) {
      bodyStartIndex = 1;
  }

  const body = lines.slice(bodyStartIndex);
  
  const ctaIndex = body.findIndex(p => p.includes("40년 현장에서 증명된 해답"));
  const mainContent = ctaIndex !== -1 ? body.slice(0, ctaIndex) : body;
  const ctaContent = ctaIndex !== -1 ? body.slice(ctaIndex) : [];


  return (
    <div className="mt-12 w-full bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{title}</h2>
        {subtitle && <h3 className="text-lg md:text-xl text-blue-700 font-semibold mb-8">{subtitle}</h3>}
        <div className="prose prose-lg max-w-none text-gray-700">
            {mainContent.map((paragraph, index) => (
              <p key={index} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
        </div>
        {ctaContent.length > 0 && (
             <div className="mt-10 pt-6 border-t-2 border-blue-600 bg-blue-50 p-6 rounded-lg">
                {ctaContent.map((paragraph, index) => {
                    if (paragraph.startsWith('홈페이지:')) {
                        const url = paragraph.substring('홈페이지: '.length);
                        return (
                            <p key={index} className="text-center font-bold text-lg text-gray-800">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300">
                                지금 바로 문의하기
                                </a>
                            </p>
                        );
                    }
                    return (
                        <p key={index} className="text-center font-bold text-lg text-gray-800 mb-4">
                            {paragraph}
                        </p>
                    );
                })}
            </div>
        )}
    </div>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [blogPost, setBlogPost] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic || isLoading) return;

    setIsLoading(true);
    setBlogPost('');
    setError(null);

    const fullPrompt = `페르소나 (Persona)

너는 '제조 혁신 멘토 TK'다. 40년간 삼성전자에서 근무한 글로벌 제조 전문가다.

12년간 제조 현장 관리자로 일했으며, 5년간 말레이시아, 베트남, 멕시코, 폴란드 등 8개국 해외 공장을 직접 지원했다.

최근 5년간은 44개가 넘는 중소기업의 스마트 혁신을 성공적으로 도왔다.

너의 핵심 강점은 [40년 삼성 경력] + [글로벌 현장 경험] + [중소기업 스마트 혁신 지원] 이 세 가지를 모두 갖춘 유일한 전문가라는 점이다.

말투는 단정하고 신뢰감 있지만, 중소기업 CEO의 고충에 깊이 공감하는 따뜻한 시선을 유지한다. 이론보다는 실제 현장 사례를 들어 쉽게 설명한다.

블로그 운영 목적 (Objective)

모든 글의 최종 목표는 잠재고객이 '제조 혁신 멘토 TK'의 전문성을 신뢰하게 만들어, 홈페이지(https://www.google.com/search?q=https://genuine-beijinho-432f80.netlify.app/)를 통해 강의나 기업 상담을 문의하게 하는 것이다.

핵심 타겟 및 고충 (Target Audience & Pain Points)

- 기초 부실 전통 제조업체 CEO: 3정5S의 중요성을 모르거나, 직원들의 저항에 부딪힘.
- 스마트공장 도입 망설이는 2세 경영인: 과잉 투자에 대한 두려움, 현실적인 로드맵 부재.
- 해외 공장 운영에 어려움을 겪는 기업: 현지 인력 관리, 품질 및 생산성 저하 문제.
- 대기업 출신 전문가를 불신하는 CEO: "현실을 모를 것"이라는 선입견.

글의 구조 및 스타일 (Post Structure & Style)

- 제목: 타겟의 고민을 정확히 찌르는 질문이나, 강력한 해결책을 암시하는 문구.
- 부제목: 제목을 보충 설명하며 글에 대한 기대감을 높이는 문장.
- 본문:
    - 도입부: 타겟의 문제 상황에 깊이 공감하며 글을 시작한다. (예: "사장님, 혹시 오늘도...")
    - 문제 정의: 왜 이 문제가 발생하는지 현장 전문가의 시선으로 명확히 진단한다.
    - 해결책 제시: 나의 경험(삼성, 해외, 중소기업 지원)을 바탕으로 한 실질적이고 구체적인 해결책을 제시한다. 어려운 전문 용어 대신 '현장의 언어'로 설명한다.
    - 기대 효과: 해결책을 실행했을 때 얻게 될 긍정적인 결과를 명확하게 보여준다.
    - 마무리 (CTA): 글의 내용을 요약하며, 독자가 자신의 문제 해결을 위해 다음 행동(문의)을 하도록 자연스럽게 유도한다. 반드시 홈페이지 링크를 포함한다.

핵심 지시사항 (Key Instructions)

- 지금부터 너는 '제조 혁신 멘토 TK'로서, 요청받을 때마다 위 모든 규칙을 반영하여 블로그 포스팅 1개를 생성한다.
- 글의 소재는 제조 분야의 최신 트렌드(1년 이내), 또는 CEO들이 구글에서 많이 검색할 만한 핵심 키워드를 기반으로 한다.
- 항상 타겟의 고충에서 출발하여, 나의 독보적인 경험으로 해결책을 제시하는 흐름을 유지한다.
- 모든 글의 마지막에는 반드시 아래 형식의 CTA(Call to Action)를 포함한다.

CTA 형식: "이론이 아닌, 40년 현장에서 증명된 해답을 원하십니까? 당신의 공장도 변할 수 있습니다. 지금 바로 '제조 혁신 멘토 TK'의 1:1 현장 진단 또는 강의를 신청해 보세요.\n홈페이지: https://www.google.com/search?q=https://genuine-beijinho-432f80.netlify.app/"
    
위 규칙을 모두 반영하여 다음 주제에 대한 블로그 포스팅을 한국어로 작성해줘.

주제: "${topic}"
    `;

    try {
      if (!process.env.API_KEY) {
        throw new Error("API 키가 설정되지 않았습니다.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: fullPrompt,
      });
      setBlogPost(response.text);
    } catch (e) {
      console.error(e);
      setError('멘토의 조언을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">40년 현장 전문가의 통찰력, 당신의 공장을 위해</h2>
          <p className="mt-4 text-xl text-gray-600">
            삼성전자, 글로벌 공장, 그리고 중소기업 혁신까지. 제조 현장의 모든 문제, '멘토 TK'가 명쾌한 해답을 드립니다.
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <label htmlFor="topic" className="block text-lg font-bold text-gray-800">
              어떤 문제로 고민하고 계십니까?
            </label>
            <p className="text-sm text-gray-500 mt-1 mb-4">예: '직원들이 3정5S를 따르지 않아요', '스마트공장, 어디서부터 시작해야 할까요?'</p>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="여기에 공장의 문제나 궁금한 점을 구체적으로 적어주세요..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="mt-4 w-full flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? <><SpinnerIcon /> 처리 중...</> : 'TK 멘토의 조언 받기'}
            </button>
          </div>

          {error && <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center animate-fade-in">{error}</div>}
          
          {blogPost && <ResponseDisplay content={blogPost} />}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} 제조 혁신 멘토 TK. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-2">이론이 아닌, 현장에서 증명된 해답을 드립니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

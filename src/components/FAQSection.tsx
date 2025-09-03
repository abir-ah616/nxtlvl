import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How long does it take to level up my account?",
    answer: "The time depends on your current and desired level. Our calculator shows exact timing, but typically ranges from a few hours to several days. We work efficiently to get you to your target level as quickly as possible."
  },
  {
    question: "Is my account safe during the leveling process?",
    answer: "Absolutely! We use secure account sharing methods and never require your password. Your account security is our top priority, and we have successfully leveled thousands of accounts without any issues."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including bKash, Nagad, Binance and Crypto. Contact us through Discord or WhatsApp to discuss payment options that work best for you."
  },
  {
    question: "Can I track the progress of my account leveling?",
    answer: "Yes! We provide regular updates on your account's progress. You can contact us anytime through our Discord server or WhatsApp for real-time updates on your leveling progress."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "Customer satisfaction is our priority. If you're not happy with our service, contact us immediately and we'll work to resolve any issues. We stand behind our work and want every customer to be completely satisfied."
  },
  {
    question: "Do you offer discounts for bulk orders?",
    answer: "Yes! We offer special pricing for customers who want to level multiple accounts or make large level jumps. Contact us directly to discuss custom pricing options that fit your needs."
  },
  {
    question: "Will my account get banned for leveling up fast?",
    answer: "Absolutely not! We use BlueStacks emulator to automate gameplay 24/7 with human-like movement patterns. No third-party applications, plugins, or cheats are used during the process. Our method mimics natural gameplay behavior, making it completely undetectable and safe. We have successfully leveled thousands of accounts without a single ban, ensuring your account remains secure throughout the entire process."
  }
];

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="px-4 md:px-6 py-8 md:py-16 scroll-reveal">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 font-headings">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-base md:text-lg px-4 font-body">
            Get answers to common questions about our service
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-cyan-400/20 shadow-xl shadow-cyan-500/20 overflow-hidden animate-fadeIn"
              style={{ 
                animationDelay: `${index * 100}ms`,
                transition: 'none',
                transform: 'none'
              }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 md:py-6 text-left flex items-center justify-between focus:outline-none"
                style={{ 
                  transition: 'none',
                  transform: 'none',
                  background: 'none',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md border border-cyan-400/40 rounded-lg flex items-center justify-center"
                    style={{ 
                      transition: 'none',
                      transform: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-bold text-base md:text-lg pr-4 font-headings">
                    {item.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openItems.has(index) ? (
                    <ChevronUp 
                      className="w-5 h-5 text-cyan-400" 
                      style={{ 
                        transition: 'none',
                        transform: 'none'
                      }}
                    />
                  ) : (
                    <ChevronDown 
                      className="w-5 h-5 text-cyan-400"
                      style={{ 
                        transition: 'none',
                        transform: 'none'
                      }}
                    />
                  )}
                </div>
              </button>
              
              {openItems.has(index) && (
                <div className="px-6 pb-4 md:pb-6 animate-slideUp">
                  <div className="pl-12 pr-4">
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed font-body">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-[#FF007F] hover:opacity-80 transition-opacity mb-8">
                    <BookOpen size={20} />
                    <span className="font-semibold">StudyHub</span>
                </Link>

                <h1 className="text-2xl md:text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-sm text-[#F5F5F5]/50 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-[#F5F5F5]/80 leading-relaxed">
                    <section>
                        <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
                        <p>
                            StudyHub collects information you provide directly, such as your name, email
                            address, and any content you upload (notes, quizzes, and profile details). We
                            also collect feedback you choose to share with us.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
                        <p>
                            We use your information to provide and improve the StudyHub platform, enable
                            note and quiz sharing, track your learning progress, respond to your feedback,
                            and keep your account secure.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold mb-2">3. Data Sharing</h2>
                        <p>
                            We do not sell your personal information. Content you choose to share publicly
                            (such as notes) is visible to other users of the platform as intended.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold mb-2">4. Data Security</h2>
                        <p>
                            We take reasonable measures to protect your data, including encrypted storage
                            and secure transmission. However, no method of transmission over the internet
                            is 100% secure.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold mb-2">5. Your Choices</h2>
                        <p>
                            You can access, update, or delete your account information at any time through
                            your profile and settings. You may also contact us to request deletion of your data.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-lg font-semibold mb-2">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, you can reach us at{' '}
                            <a href="mailto:reeshiraj01@gmail.com" className="text-[#00E5FF] hover:underline">
                                reeshiraj01@gmail.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
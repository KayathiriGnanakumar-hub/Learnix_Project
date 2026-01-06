import {
  Briefcase,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  TrendingUp,
  BookOpen,
} from "lucide-react";

export default function FeatureSection() {
  return (
    <div className="bg-slate-50">
      {/* INTERNSHIPS SECTION */}
      <section className="py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Briefcase className="w-10 h-10 text-teal-600" />
              Internship Opportunities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get hands-on experience with industry-leading companies while still learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Internship Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-40 bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <Globe className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Full-Stack Development</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Work on real projects using React, Node.js, and databases with experienced mentors
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>3-6 Month Duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Paid Opportunity</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Job Guarantee Option</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Internship Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-40 bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Data Analytics</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Analyze real-world datasets, build dashboards, and derive insights using Python & SQL
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>3-6 Month Duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Flexible Schedule</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                    <span>Certificate Included</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Internship Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
              <div className="h-40 bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">UI/UX Design</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Create beautiful interfaces and user experiences for web and mobile applications
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-cyan-600" />
                    <span>3-6 Month Duration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-cyan-600" />
                    <span>Portfolio Building</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-cyan-600" />
                    <span>Industry Mentorship</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATES SECTION */}
      <section className="py-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Award className="w-10 h-10 text-amber-600" />
              Professional Certificates
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Earn industry-recognized credentials that boost your resume and career prospects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Certificate Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Course Completion</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Receive a digital certificate upon completing all course videos and quizzes with passing grades
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Instant Issuance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>LinkedIn Integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-amber-600" />
                    <span>Lifetime Validity</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  View Samples <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Award className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Specialization Badge</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Complete multiple related courses to earn a specialization badge showcasing your expertise
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Multi-Course Program</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Employer Recognized</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Digital Badge</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Explore Paths <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Certification</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Take advanced assessments and projects to earn premium certifications with higher recognition
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-pink-600" />
                    <span>Peer-Reviewed Projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-pink-600" />
                    <span>Advanced Assessment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-pink-600" />
                    <span>Job Referral Option</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLACEMENT ASSISTANCE SECTION */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
              <Briefcase className="w-10 h-10 text-emerald-600" />
              Placement & Career Assistance
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're committed to helping you land your dream job with comprehensive support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placement Card 1 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Resume & Profile Review</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Expert feedback on your resume, LinkedIn profile, and portfolio to make you job-ready
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>1-on-1 Review Sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Optimization Tips</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Portfolio Templates</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Get Reviewed <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Placement Card 2 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-linear-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Interview Preparation</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Master coding interviews, system design, and behavioral questions with guided practice sessions
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Mock Interviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Problem Solving Drills</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Expert Mentorship</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Start Practice <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Placement Card 3 */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Globe className="w-16 h-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Job Referrals & Networking</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Get direct referrals to partner companies and access exclusive job opportunities
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Partner Companies Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Direct Referrals</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Alumni Network</span>
                  </div>
                </div>
                <button className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Explore Jobs <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

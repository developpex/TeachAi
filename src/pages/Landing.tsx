import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Brain,
  Zap, 
  Users, 
  ArrowRight, 
  Star,
  CheckCircle2,
  Laptop
} from 'lucide-react';
import { PublicNavigation } from '../components/navigation/PublicNavigation.tsx';

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 to-primary/90" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-accent/20 rounded-full text-accent mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">AI-Powered Teaching Assistant</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Revolutionize Your Teaching with AI
            </h1>
            
            <p className="text-xl text-cream/90 mb-12 leading-relaxed">
              Transform your classroom experience with our AI teaching assistant. Create engaging lessons, grade assignments, and track progress—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white rounded-xl hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Teaching Smarter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-dark rounded-xl hover:bg-cream transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '10,000+', label: 'Active Teachers' },
              { number: '500,000+', label: 'Lessons Created' },
              { number: '98%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-bold text-primary-dark mb-2">{stat.number}</div>
                <div className="text-primary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-primary">
              Powerful tools designed for modern educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Lesson Planning',
                description: 'Generate comprehensive lesson plans in minutes with our AI assistant'
              },
              {
                icon: Laptop,
                title: 'Smart Assignments',
                description: 'Create and grade assignments automatically with detailed feedback'
              },
              {
                icon: Users,
                title: 'Student Progress',
                description: 'Track individual and class progress with intuitive analytics'
              },
              {
                icon: Star,
                title: 'Resource Library',
                description: 'Access thousands of ready-to-use teaching materials and templates'
              },
              {
                icon: Zap,
                title: 'Real-time Insights',
                description: 'Get instant feedback on student engagement and understanding'
              },
              {
                icon: CheckCircle2,
                title: 'Personalized Learning',
                description: 'Adapt content to each student\'s learning pace and style'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sage/10 hover:border-accent/20"
              >
                <div className="p-3 bg-accent/10 rounded-xl inline-block mb-6 group-hover:bg-accent/20 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-primary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Educators
            </h2>
            <p className="text-xl text-cream/90">
              Join thousands of satisfied teachers using TeachAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "TeachAI has transformed how I prepare my lessons. It's like having a personal assistant",
                author: "Sarah Johnson",
                role: "High School Science Teacher",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&q=80"
              },
              {
                quote: "The automated grading saves me hours every week. I can focus more on actual teaching",
                author: "Michael Chen",
                role: "Middle School Math Teacher",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&q=80"
              },
              {
                quote: "The personalized learning features have helped my students improve significantly",
                author: "Emily Rodriguez",
                role: "Elementary School Teacher",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&q=80"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <p className="text-cream/90 mb-8 text-lg italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-cream/80 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-accent to-accent-dark rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Teaching?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
                Join thousands of educators who are already using TeachAI to enhance their teaching experience.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-white text-accent rounded-xl hover:bg-cream transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920')] opacity-10 bg-cover bg-center" />
          </div>
        </div>
      </section>
    </div>
  );
}
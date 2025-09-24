import { faeWhite } from '@assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPalette, faHandshake, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const CommunitySection2 = () => (
  <section className="relative py-20 overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-300 rounded-full blur-2xl animate-bounce"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content Side */}
        <div className="space-y-8 animate-slide-in-left">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-raleway mb-6">
              Find Amazing Artists
              <br className="sm:block hidden" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                For Hire
              </span>
            </h2>
            <p className="text-xl text-white/80 font-raleway leading-relaxed max-w-lg">
              Discover talented artists in our community gallery. Connect with creators who can bring your vision to life with their unique styles and expertise.
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faUsers} className="text-3xl text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-raleway mb-2">Diverse Community</h3>
              <p className="text-white/70 font-raleway text-sm">Connect with artists from all backgrounds and styles</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105">
              <FontAwesomeIcon icon={faPalette} className="text-3xl text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-raleway mb-2">Unique Styles</h3>
              <p className="text-white/70 font-raleway text-sm">Explore various artistic techniques and approaches</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/artists"
              className="group inline-flex items-center justify-center px-8 py-4 bg-blue-gradient text-primary font-raleway font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <FontAwesomeIcon icon={faUsers} className="mr-3" />
              Browse Artists
              <FontAwesomeIcon icon={faArrowRight} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/hire"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-raleway font-bold rounded-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faHandshake} className="mr-3" />
              Post a Job
            </Link>
          </div>
        </div>

        {/* Image Side */}
        <div className="relative animate-slide-in-right">
          <div className="relative">
            <img
              src={faeWhite}
              alt="Community Artists"
              className="w-full h-auto relative z-10 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700"
            />

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-bounce"></div>

            {/* Gradient Overlays */}
            <div className="absolute -z-10 -top-8 -left-8 w-[110%] h-[110%] bg-gradient-to-br from-white/20 to-transparent rounded-3xl blur-xl"></div>
            <div className="absolute -z-20 -bottom-8 -right-8 w-[90%] h-[90%] bg-gradient-to-tl from-purple-500/30 to-transparent rounded-3xl blur-2xl"></div>
          </div>

          {/* Stats Cards */}
          <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-slide-in-up" style={{animationDelay: '0.5s'}}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-raleway">500+</div>
              <div className="text-white/70 font-raleway text-sm">Active Artists</div>
            </div>
          </div>

          <div className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-slide-in-up" style={{animationDelay: '0.7s'}}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-raleway">1000+</div>
              <div className="text-white/70 font-raleway text-sm">Projects Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
 

export default CommunitySection2
import { useEffect } from "react";
import Aboutimage from "../assets/aboutpage.jpg";
const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="w-full pt-10 bg-white pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Left Image Section */}
          <div className="lg:w-1/2">
            <div className="border-4 border-green-600 rounded-xl p-4">
              <img className="w-full h-auto object-cover rounded-lg" src={Aboutimage} alt="Organic Farming" />
            </div>
          </div>

          {/* Right Content Section */}
          <div className="lg:w-1/2">
            <h6 className="text-green-600 uppercase font-semibold text-sm mb-2">About Us</h6>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">Parnanetra Ayurvedic Agro System</h1>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Parnanetra has been working in Organic Agriculture since 1988, with over 30 years of experience in Sustainable Agriculture Solutions, Research & Development, and Manufacturing of Agro
              Inputs.
            </p>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Our services and products are offered as an integrated system known as the <strong>“Parnanetra Ayurvedic Agro System”</strong>, based on the ancient Indian science of{" "}
              <strong>“Rasayan Shastra – Ayurveda”</strong>.
            </p>

            <p className="text-gray-600 mb-6 leading-relaxed">
              This system is designed to combat modern agricultural challenges such as climate change, water scarcity, and soil degradation by restoring the natural balance of{" "}
              <strong>Vata, Pitta, and Kapha</strong> in plants.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-green-50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Ayurvedic Farming</h4>
                <p className="text-gray-600 text-sm">Based on Tridosha balance to enhance plant vitality, immunity, and productivity naturally.</p>
              </div>

              <div className="bg-green-50 p-5 rounded-xl">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Sustainable Agriculture</h4>
                <p className="text-gray-600 text-sm">Improves soil health, optimizes water usage, and supports long-term environmental sustainability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

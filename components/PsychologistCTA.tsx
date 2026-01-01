import { FaPhoneAlt } from 'react-icons/fa';

export default function PsychologistCTA() {
  const whatsappNumber = '919605565175';
  const message = 'Hi, I need support';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card bg-blue-500 text-white shadow-xl border-4 border-blue-600 rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-all cursor-pointer block"
    >
      <div className="card-body p-6 sm:p-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="shrink-0">
            <div className="bg-white rounded-full p-4 sm:p-6 shadow-md">
              <FaPhoneAlt className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="card-title text-lg sm:text-xl text-white">
              Need Psychologist support?
            </h2>
          </div>
        </div>
      </div>
    </a>
  );
}

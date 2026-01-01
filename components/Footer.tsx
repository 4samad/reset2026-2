import { FaWhatsapp } from 'react-icons/fa';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="t-12">
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left">
            <Logo size="lg" className="mb-2" />
            <p className="text-sm opacity-70">An initiative by the <a className='border-b-2 border-neutral-400' target='_blank' href="https://detoxmind.org">Detox Mind</a> team</p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3">
            <p className="text-sm font-semibold">Need Support?</p>
            <a
              href="https://wa.me/919605565175"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm gap-2"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>+91 96055 65175</span>
            </a>
          </div>
        </div>

        <div className="divider my-6 opacity-30"></div>

        <div className="text-center text-xs opacity-60">
          <p>© 2026 Detox Mind. Your journey is private and secure.</p>
        </div>
      </div>
    </footer>
  );
}

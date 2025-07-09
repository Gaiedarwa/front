import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-white pt-10 pb-2 px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-8 gap-8 items-start">
        {/* Colonne logo et contact */}
        <div className="col-span-2 min-w-[180px] flex flex-col gap-2">
          <div className="mb-2">
            <div className="text-4xl font-bold">D</div>
            <div className="font-bold tracking-widest text-lg">DRÄXLMAIER</div>
          </div>
          <div className="text-sm mb-2">+216 31 260-401</div>
          <a href="#" className="text-sm hover:underline">Contact</a>
          <a href="#" className="text-sm hover:underline">Information Cyber Security</a>
          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook"><FaFacebookF size={22} /></a>
            <a href="#" aria-label="YouTube"><FaYoutube size={22} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={22} /></a>
          </div>
        </div>
        {/* Colonne Qui sommes-nous */}
        <div>
          <div className="font-bold text-lg mb-2">Qui sommes-nous ?</div>
          <ul className="space-y-1 text-sm">
            <li>Sousse</li>
            <li>Zaouiet Sousse</li>
            <li>Siliana</li>
            <li>Eljem</li>
            <li>Jemmal</li>
            <li>TPT Tunisia</li>
            <li>Sites dans le monde entier</li>
            <li>Conformité</li>
            <li>Histoire</li>
          </ul>
        </div>
        {/* Colonne Notre mission */}
        <div>
          <div className="font-bold text-lg mb-2">Notre mission</div>
          <ul className="space-y-1 text-sm">
            <li>Systèmes intérieurs</li>
            <li>Systèmes électriques</li>
            <li>Systèmes de composants</li>
            <li>Systèmes de batteries</li>
          </ul>
        </div>
        {/* Colonne Notre façon d'agir */}
        <div>
          <div className="font-bold text-lg mb-2">Notre façon d'agir</div>
          <ul className="space-y-1 text-sm">
            <li>L'humain</li>
            <li>Environnement</li>
            <li>Produits</li>
          </ul>
        </div>
        {/* Colonne Carrière */}
        <div>
          <div className="font-bold text-lg mb-2">Carrière</div>
          <ul className="space-y-1 text-sm">
            <li>Offres d'emploi</li>
          </ul>
        </div>
        {/* Colonne Actualités */}
        <div>
          <div className="font-bold text-lg mb-2">Actualités</div>
          <ul className="space-y-1 text-sm">
            <li>Presse</li>
          </ul>
        </div>
        {/* Colonne Search */}
        <div>
          <div className="font-bold text-lg mb-2">Search</div>
        </div>
        {/* Colonne International */}
        <div className="flex flex-col items-center col-span-1">
          <div className="font-bold text-lg mb-2 whitespace-nowrap">DRÄXLMAIER International</div>
          <img src="/globe.svg" alt="World map" className="w-16 h-16 object-contain mt-2" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-700 pt-3 flex flex-col items-center text-xs text-gray-300">
        <div className="text-center">
          <span className="text-cyan-500 font-bold">Copyright DRÄXLMAIER Group 2024</span>
          <span className="ml-2">- Imprint - Mentions légales - Protection des données - Contact - Plan du site</span>
        </div>
        <div className="mt-3">
          <span className="inline-block bg-cyan-500 rounded-full p-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25v2.25m0 2.25h.008v.008H12v-.008zm0 0a8.25 8.25 0 1 1 0-16.5 8.25 8.25 0 0 1 0 16.5z" /></svg></span>
        </div>
      </div>
    </footer>
  );
} 
import { SignUpButton } from '@clerk/tanstack-react-start'

const Hero = () => {
  return (
    <section
      id="hero"
      className="mx-auto px-5 mt-10 flex justify-center items-center gap-10 relative"
    >
      <div className="flex flex-col">
        <p className="self-start border border-dashed border-blue-300 text-blue-500 leading-none px-2 py-1 rounded-full text-xs font-medium">
          TESTUJ BEZPŁATNIE PRZEZ 7 DNI!
        </p>
        <h1 className="font-black text-6xl font-display mt-5 text-blue-500">
          Zarządzaj awariami.{' '}
          <span className="block text-primary">Szybko i wygodnie.</span>
        </h1>
        <p className="text-xl font-display mt-5">
          System do zarządzania usterkami oparty o kody QR.
          {/* Skanujesz, zgłaszasz, naprawiasz.
          <span className="block">Bez zbędnych formalności i aplikacji.</span> */}
        </p>
        <SignUpButton>
          <button className="mt-7 bg-blue-500 self-start text-primary-foreground px-4 py-2 rounded-full font-medium cursor-pointer">
            Jak to działa?
          </button>
        </SignUpButton>
      </div>

      {/* obrazek */}
      <div className="py-8 px-3 perspective-[1000px] rotate-x-[4deg] rotate-y-[-16deg] rotate-z-[4deg] rounded-2xl shadow-[24px_16px_64px_0_rgba(0,0,0,0.20)]">
        <p className="text-center font-display font-black text-3xl">
          ZGŁOŚ <span className="block">USTERKĘ</span>
        </p>
        <img
          src="/qrcode.svg"
          alt="QR Code"
          className="w-50 h-50 mt-5 rounded-md mx-center text-center"
        />
      </div>
    </section>
  )
}

export default Hero

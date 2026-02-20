import { SignUpButton } from '@clerk/tanstack-react-start'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'

const Hero = () => {
  return (
    <section id="hero" className="mx-auto px-5 max-w-5xl pt-5">
      <div className="max-w-3xl flex flex-col items-center mx-auto">
        <p className="flex items-center gap-2 border border-blue-300 bg-blue-50 text-blue-500 leading-none px-3 py-1.5 rounded-full text-sm font-semibold">
          <div className="animate-pulse size-2 rounded-full bg-blue-500"></div>
          Wypróbuj za darmo
        </p>
        <h1 className="font-black text-5xl font-display mt-10 text-center ">
          Zarządzanie{' '}
          <span className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-200 -z-3 -skew-3 blur" />
            awariami
          </span>{' '}
          bez chaosu.
        </h1>
        <p className="text-lg mt-5 max-w-3xl text-center">
          System do zarządzania usterkami oparty o{' '}
          <span className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-200 -z-3 -skew-7 blur" />
            kody QR
          </span>
          .
        </p>
        <p className="mt-5 max-w-xl text-center text-muted-foreground">
          Koniec z karteczkami, zagubionymi mailami i pytaniami "dlaczego nie
          działa?". Asseto porządkuje usterki i awarie w Twojej firmie od
          pierwszego dnia.
        </p>
        <div className="flex gap-4 mt-5">
          <Button className="rounded-full bg-blue-600">
            Załóż konto za darmo
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/funkcje">Zobacz możliwości</Link>
          </Button>
        </div>
      </div>

      {/* obrazek */}
      {/* <div className="py-8 px-3 perspective-[1000px] rotate-x-[4deg] rotate-y-[-16deg] rotate-z-[4deg] rounded-2xl shadow-[24px_16px_64px_0_rgba(0,0,0,0.20)]">
        <p className="text-center font-black text-3xl">
          ZGŁOŚ <span className="block">USTERKĘ</span>
        </p>
        <img
          src="/qrcode.svg"
          alt="QR Code"
          className="w-50 h-50 mt-5 rounded-md mx-center text-center"
        />
      </div> */}
    </section>
  )
}

export default Hero

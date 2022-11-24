import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col mt-auto fixed bottom-0 left-0 z-20 p-4 w-full border-t md:flex md:items-center md:justify-around md:p-6font-bold py-2">
      <div>
        <p>
          <Link
            className="decoration-solid mr-16"
            href="https://github.com/PhilippSchlechter"
          >
            <span className="decoration-solid underline">bookshelves</span>™
          </Link>

          <span className="font-light ml-16">
            Final project 2022{' '}
            <Link target="_blank" href="https://upleveled.io/">
              @<span className="decoration-solid underline">upLeveled</span>
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
}

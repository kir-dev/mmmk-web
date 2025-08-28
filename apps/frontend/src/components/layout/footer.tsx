import Link from 'next/link';
import { FaFacebookF } from 'react-icons/fa';
import { LuHeart } from 'react-icons/lu';
import { SiGmail } from 'react-icons/si';

export function Footer() {
  return (
    <footer className='p-4 dark:bg-zinc-900 border-t border-orange-500'>
      <div className='grid grid-cols-1 lg:grid-cols-3 w-full container mx-auto gap-4 items-center'>
        <div className='flex gap-4 justify-center lg:justify-start items-center'>
          <Link
            href='https://www.facebook.com/muzsikamivelomernokokklubja'
            target='_blank'
            className='flex items-center'
          >
            <FaFacebookF size={20} />
          </Link>
          <Link href='mailto:mmmk@sch.bme.hu' className='flex items-center'>
            <SiGmail size={22} />
          </Link>
        </div>
        <Link href='https://kir-dev.hu' target='_blank'>
          <p className='text-sm text-center lg:text-center flex items-center justify-center gap-1'>
            Made with <LuHeart size={14} /> by
            <span className='opacity-80 font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-transparent bg-clip-text'>
              Kir-Dev
            </span>
          </p>
        </Link>
        <p className='text-sm text-center lg:text-right '>&copy; 2025 MMMK</p>
      </div>
    </footer>
  );
}

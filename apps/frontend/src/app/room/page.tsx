import { Card, CardContent } from '@/components/ui/card';

export default function Room() {
  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4 '>
        <h1 className='text-2xl font-semibold text-primary'>Próbaterem</h1>
      </div>
      <Card className='m-4'>
        <CardContent>
          <h1 className='text-2xl font-semibold my-8'>Eszközök</h1>
          <h2 className='text-xl font-semibold mb-4'>Ludwig dobcucc</h2>
          <p className='text-md font-semibold mb-2'>Adatok:</p>
          <ul className='list-disc list-inside space-y-1 mb-8'>
            <li>Pergő: 14&quot;</li>
            <li>Tamok: 10&quot; felső, 12&quot; felső, 14&quot; álló</li>
            <li>Lábdob: 22&quot;</li>
            <li>
              Cinek: (Változó, attól függően, éppen melyik repedt/tört szanaszét)
              <br />
              <span className='ml-12'> Lábcin, Két crash, Splash, Ride, Kínai</span>
            </li>
            <li>Duplázó</li>
            <li>Kolomp</li>
            <li>Állványok mindenhez</li>
          </ul>
          <h2 className='text-xl font-semibold mb-4'>Peavey Valveking 112 Gitárerősítő Combo</h2>
          <p className='text-md font-semibold mb-2'>Adatok:</p>
          <ul className='list-disc list-inside space-y-1 mb-8'>
            <li>50 Wattos</li>
            <li>Full csöves</li>
            <li>3 db 12AX7-es előfok</li>
            <li>2 db 6L6GC-es végfok (2015 márciusban cserélve újakra)</li>
            <li>1 db 12-es hangszóró</li>
            <li>Két csatorna: Clean, Lead</li>
            <li>Csatornánként 3 sávos EQ, Volume, Leaden Gain is</li>
            <li>Effect loop</li>
            <li>Zengető</li>
          </ul>
          <h2 className='text-xl font-semibold mb-4'>Line6 Spider III 120 Gitárerősítő Combo</h2>
          <p className='text-md font-semibold mb-2'>Adatok:</p>
          <ul className='list-disc list-inside space-y-1 mb-8'>
            <li>Digitális</li>
            <li>120 Wattos</li>
            <li>12 erősítőmodell: Clean, Twang, Blues, Crunch, Metal, Insane (2 verzió mindegyikből)</li>
            <li>Végtelen digitális effekt: Phaser, Chorus/Flanger, Tremolo, Delay, Sweep Echo, Tape Echo, Reverb</li>
            <li>250 + 150 gyári preset</li>
            <li>36 saját preset</li>
            <li>4 csatornás lábkapcsoló</li>
            <li>2 db 10-es Custom Celestion hangszóró</li>
          </ul>
          <h2 className='text-xl font-semibold mb-4'>Gallien-Krueger Backline 600 Basszus erősítőfej</h2>
          <p className='text-md font-semibold mb-2'>Adatok:</p>
          <ul className='list-disc list-inside space-y-1 mb-8'>
            <li>300 Watt @ 4 ohm</li>
            <li>4 sávos EQ</li>
            <li>2 csatorna</li>
            <li>Contour poti</li>
            <li>Effect loop</li>
            <li>XLR, hangoló kimenet</li>
          </ul>
          <h2 className='text-xl font-semibold mb-4'>Gallien-Krueger GLX Basszusláda</h2>
          <p className='text-md font-semibold mb-2'>Adatok:</p>
          <ul className='list-disc list-inside space-y-1 mb-4'>
            <li>400 Watt @ 8 ohm</li>
            <li>4 db 10&quot;-es hangszóró</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

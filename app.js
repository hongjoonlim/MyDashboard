const codes={0:['Clear sky','☀️'],1:['Mainly clear','🌤️'],2:['Partly cloudy','⛅'],3:['Overcast','☁️'],45:['Fog','🌫️'],48:['Rime fog','🌫️'],51:['Light drizzle','🌦️'],53:['Drizzle','🌦️'],55:['Dense drizzle','🌧️'],61:['Light rain','🌧️'],63:['Rain','🌧️'],65:['Heavy rain','🌧️'],71:['Light snow','🌨️'],73:['Snow','🌨️'],75:['Heavy snow','❄️'],80:['Rain showers','🌦️'],81:['Moderate rain showers','🌧️'],82:['Heavy rain showers','⛈️'],95:['Thunderstorm','⛈️'],96:['Thunderstorm with hail','⛈️'],99:['Thunderstorm with hail','⛈️']};
const $=s=>document.querySelector(s), fmt=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);
function clock(){const now=new Date(); $('#today').textContent=new Intl.DateTimeFormat('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(now); document.querySelectorAll('.clock[data-zone]').forEach(clock=>{const zone=clock.dataset.zone, parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)])), hour=parts.hour%12, minute=parts.minute; clock.querySelector('.hour-hand').style.setProperty('--angle',(hour*30+minute*.5)+'deg'); clock.querySelector('.minute-hand').style.setProperty('--angle',(minute*6)+'deg'); clock.querySelector('.time').textContent=new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);});} clock(); setInterval(clock,60000);
async function loadWeather(place){
  try {
    const g=await fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(place)+'&count=1&language=en&format=json').then(r=>r.json());
    if(!g.results?.[0]) throw Error();
    const p=g.results[0], u='https://api.open-meteo.com/v1/forecast?latitude='+p.latitude+'&longitude='+p.longitude+'&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_probability_max&timezone=auto&forecast_days=6';
    const d=await fetch(u).then(r=>r.json()), c=d.current, w=codes[c.weather_code]||['Weather unavailable','🌡️'];
    $('#place').textContent=p.name+(p.country?' · '+p.country:'');
    $('#temp').textContent=Math.round(c.temperature_2m)+'°';
    $('#condition').textContent=w[0]; $('#weather-icon').textContent=w[1];
    $('#apparent').textContent=Math.round(c.apparent_temperature)+'°';
    $('#rain').textContent=d.daily.precipitation_probability_max[0]+'%';
    $('#wind').textContent=Math.round(c.wind_speed_10m)+' km/h';
    $('#forecast').innerHTML=d.daily.time.slice(1).map((date,index)=>{
      const i=index+1, z=codes[d.daily.weather_code[i]]||['','🌡️'];
      return '<div class="day">'+new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:d.timezone}).format(new Date(date+'T12:00:00'))+'<span>'+z[1]+'</span><b>'+Math.round(d.daily.temperature_2m_max[i])+'°</b></div>';
    }).join('');
    localStorage.dashboardPlace=place;
  } catch { $('#condition').textContent='Unable to load weather data'; }
}
async function loadRates(){try { const d=await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,KRW').then(r=>r.json()), eur=d.rates.KRW, usd=eur/d.rates.USD; $('#usd-rate').textContent='₩'+fmt(usd); $('#eur-rate').textContent='₩'+fmt(eur); $('#rate-updated').textContent='As of '+d.date+' · ECB reference rates'; }catch{$('#rate-updated').textContent='Unable to load exchange rates';}}
const timeFactors={s:1,ms:1e-3,us:1e-6,ns:1e-9}, timeFormat=new Intl.NumberFormat('en-US',{maximumSignificantDigits:10});
function updateTime(){const value=Number($('#time-input').value), seconds=value*timeFactors[$('#time-unit').value]; ['s','ms','us','ns'].forEach(unit=>$('#time-'+unit).textContent=Number.isFinite(seconds)?timeFormat.format(seconds/timeFactors[unit]):'—');}
function updateBase(){const input=$('#base-input').value.trim(), unit=$('#base-unit').value, note=$('#base-note'), patterns={bin:/^[01]+$/,dec:/^\d+$/,hex:/^[\da-f]+$/i}, clean=input.replace(/^0[bBxX]/,''); try {if(!clean||!patterns[unit].test(clean)) throw Error(); const value=BigInt(unit==='bin'?'0b'+clean:unit==='hex'?'0x'+clean:clean), binary=value.toString(2).replace(/\B(?=(?:\d{4})+(?!\d))/g,' '); $('#base-bin').textContent=binary; $('#base-dec').textContent=value.toLocaleString('en-US'); $('#base-hex').textContent=value.toString(16).toUpperCase(); note.textContent='Supports arbitrary-size integer conversion.'; note.className='converter-note';}catch{['bin','dec','hex'].forEach(unit=>$('#base-'+unit).textContent='—'); note.textContent='Enter a positive integer valid for the selected base.'; note.className='converter-note error';}}
$('#time-input').addEventListener('input',updateTime); $('#time-unit').addEventListener('change',updateTime); $('#base-input').addEventListener('input',updateBase); $('#base-unit').addEventListener('change',updateBase); updateTime(); updateBase();
const dialog=$('#place-dialog'); $('#change-place').onclick=()=>dialog.showModal(); $('#save-place').onclick=e=>{e.preventDefault(); const value=$('#place-input').value.trim(); if(value){loadWeather(value); dialog.close();}}; const savedPlace=localStorage.dashboardPlace, initialPlace=!savedPlace||savedPlace==='Seoul'?'Vienna':savedPlace; loadWeather(initialPlace); loadRates();

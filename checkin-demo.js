/* Demo backend shared by checkin.html and checkin-board.html.
 * Data lives in this browser's localStorage, so a check-in made in one tab
 * shows up on the live board in another tab of the same browser.
 * Demo PIN: 1234. Nothing is sent anywhere. */
(function () {
  const KEY = 'ci_demo_db_v1';
  const PIN = '1234';

  function seed() {
    const first = ['Aarav','Priya','Rohan','Ananya','Vikram','Sneha','Arjun','Kavya','Rahul','Meera','Sanjay','Pooja','Amit','Neha','Karan','Divya','Ravi','Isha','Suresh','Lakshmi','John','Emily','Michael','Sarah','David','Maria','James','Linda','Robert','Jennifer'];
    const last = ['Sharma','Patel','Agrawal','Gupta','Iyer','Reddy','Mehta','Shah','Nair','Kapoor','Smith','Johnson','Brown','Garcia','Miller'];
    const guests = [];
    for (let i = 0; i < 60; i++) {
      const fn = first[i % first.length], ln = last[(i * 7) % last.length];
      const email = (fn + '.' + ln + i).toLowerCase() + '@example.com';
      const phone = '(555) ' + String(200 + i * 13).slice(-3) + '-' + String(1000 + i * 137).slice(-4);
      guests.push({ id: 'e:' + email, name: fn + ' ' + ln, email, phone,
        seat: i === 5 ? '' : 'Table ' + (Math.floor(i / 8) + 1) + ' · Seat ' + (i % 8 + 1) });
    }
    const checkins = {};
    checkins[guests[2].id] = { at: new Date(Date.now() - 600000).toISOString(), by: 'Door 2 – Demo' };
    return { guests, checkins, walkins: [] };
  }

  let mem = null; // fallback when localStorage is unavailable
  function read() {
    try { const v = localStorage.getItem(KEY); if (v) return JSON.parse(v); } catch (e) { if (mem) return mem; }
    const db = seed(); write(db); return db;
  }
  function write(db) { mem = db; try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }

  function api(action, p, pin) {
    return new Promise((resolve, reject) => setTimeout(() => {
      if (pin !== PIN) return reject(Object.assign(new Error('Wrong PIN (demo PIN is 1234)'), { auth: true }));
      const db = read();
      switch (action) {
        case 'load':   return resolve({ ok: true, event: 'Demo Gala 2026', guests: db.guests.concat(db.walkins), checkins: db.checkins });
        case 'status': return resolve({ ok: true, checkins: db.checkins, walkins: db.walkins });
        case 'checkin':
          if (db.checkins[p.id]) return resolve({ ok: true, already: true, ...db.checkins[p.id] });
          db.checkins[p.id] = { at: p.at, by: p.device }; write(db); return resolve({ ok: true });
        case 'undo':
          delete db.checkins[p.id]; write(db); return resolve({ ok: true });
        case 'walkin':
          if (!db.walkins.some(w => w.id === p.id)) db.walkins.push({ id: p.id, name: p.name, phone: p.phone, email: p.email, seat: p.seat, walkin: true });
          db.checkins[p.id] = { at: p.at, by: p.device }; write(db); return resolve({ ok: true });
        default: return reject(new Error('Unknown action'));
      }
    }, 120));
  }

  function reset() { write(seed()); }

  window.CheckinDemo = { api, reset };
})();

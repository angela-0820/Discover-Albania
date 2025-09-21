(function(){
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Date min = today
  const tourDate = document.getElementById('tourDate');
  if (tourDate) tourDate.setAttribute('min', new Date().toISOString().split('T')[0]);

  // Save to localStorage so Admin page can read it
  const KEY = 'da_reservations';
  function getReservations(){ try{ return JSON.parse(localStorage.getItem(KEY))||[] }catch{ return [] } }
  function setReservations(list){ localStorage.setItem(KEY, JSON.stringify(list)); }

  const form = document.getElementById('reservationForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    form.classList.add('was-validated');
    if(!form.checkValidity()) return;

    const entry = {
      name: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      destination: document.getElementById('destination').value,
      date: document.getElementById('tourDate').value,
      message: document.getElementById('message').value.trim()
    };
    const list = getReservations(); list.push(entry); setReservations(list);

    alert('Thank you for reserving! We’ll get back to you soon.');
    form.reset(); form.classList.remove('was-validated');
    // Keep the min date after reset
    if (tourDate) tourDate.setAttribute('min', new Date().toISOString().split('T')[0]);
  });
})();
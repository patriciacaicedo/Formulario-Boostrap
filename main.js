document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('personalDataForm');
    const selectPais = document.getElementById('pais');
    const contrastToggle = document.getElementById('toggleContrast');
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');

    const fechaMinima = new Date('1910-01-01');
    const fechaActual = new Date();
    fechaNacimientoInput.min = fechaMinima.toISOString().split('T')[0];
    fechaNacimientoInput.max = fechaActual.toISOString().split('T')[0];

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const paises = data
                .map(country => ({
                    nombre: country.translations.spa?.common || country.name.common,
                    codigo: country.cca2
                }))
                .sort((a, b) => a.nombre.localeCompare(b.nombre));

            paises.forEach(pais => {
                const option = document.createElement('option');
                option.value = pais.codigo;
                option.textContent = pais.nombre;
                selectPais.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar la lista de países:', error));

    contrastToggle.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        this.textContent = document.body.classList.contains('high-contrast') ? 'Contraste normal' : 'Alto contraste';
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (this.checkValidity()) {
            alert('Formulario enviado con éxito!');
            this.reset();
            this.classList.remove('was-validated');
        } else {
            event.stopPropagation();
        }
        this.classList.add('was-validated');
    });

    fechaNacimientoInput.addEventListener('input', function() {
        const fechaNacimiento = new Date(this.value);
        if (fechaNacimiento < fechaMinima || fechaNacimiento > fechaActual) {
            this.setCustomValidity('La fecha de nacimiento debe estar entre 1900 y la fecha actual.');
        } else {
            this.setCustomValidity('');
        }
    });
});
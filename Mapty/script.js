
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

class workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

constructor (coords, distance, duration)
{
        this.coords = coords;
        this.distance = distance; //kilo
        this.duration = duration ; //min
    }
   
}
class Running extends workout {
    type = 'running';
     constructor(coords,distance,duration,cadence){
     super(coords,distance,duration);
        this.cadence= cadence;
        this.calcPace();
     }
     calcPace() {
        this.pace= this.duration / this.distance;
        return this.pace; 
    }
}
class Cycling extends workout {
    type = 'cycling';
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain= elevationGain;
        //this.type='cycling';
        this.calcSpeed();
    }    
    calcSpeed(){
      this.speed = this.distance / ( this.duration / 60);
      return this.speed;
    }
}

const run1 = new Running ([30, 56],4,34,561);
const Cycling1= new Cycling ([30, 96],4,89,841);
console.log(run1,Cycling1);

/////////////////////////////////////// 
//APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App{
      #map;
      #mapEvent;
      #workouts = [];
      
    constructor(){
        this._getPositioin();
             form.addEventListener('submit',this._newWorkout.bind(this));
              inputType.addEventListener('change' ,this._toggleElevationField);
        }
 _getPositioin(){
            if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition( this._loadMap.bind(this),function() {
        alert('could not get your position');
    }
);
}

 _loadMap(position){
    
    const {latitude} = position.coords;
    const {longitude} = position.coords;
                 
           console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
           
            const coords = [latitude,longitude]
            this.#map = L.map('map').setView(coords, 12);
               // console.log(map);
           
           L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
               attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
           }).addTo(this.#map);
           
           // handling cloik on map
            this.#map.on('click',this._showForm.bind(this));
        }

   _showForm(mapE){
            this.#mapEvent = mapE
            form.classList.remove('hidden');
            inputDistance.focus();
        }

   _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')

       }

   _newWorkout(e){
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);
        
        e.preventDefault();
          
     //get data form
       const type = inputType.value;
       const distance = +inputDistance.value;
       const duration = +inputDuration.value;
       const { lat,lng } = this.#mapEvent.latlng;
       let workout;
       //if workout running, create running object

    if(type === 'running'){
        //check if data is valid
        const cadence = +inputCadence.value;

        if (
        //  !Number.isFinite(distance)
        // || !Number.isFinite(duration)
        // || !Number.isFinite(cadence)
            !validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence) 
             )
               return alert('input have to be positive number!');

               workout = new Running([lat , lng], distance, duration, cadence);
               }

       //if workout cycling, create cycling object
       if (type === 'cycling'){
         const elevation = +inputElevation.value;

         if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration)
         ) 

             return alert('input have to be positive number!');
             workout = new Cycling([lat,lng], distance, duration, elevation);

       }


       // Add new object to workout object
       this.#workouts.push(workout);
       console.log(workout);

       //render workout on map as marker

           this._renderWorkoutMarker(workout);
    
       // render workout on list
      this._renderWorkout(workout)

   // hide form +clear the field
        inputDistance.value = inputDuration.value = inputCadence.value= inputElevation.value = '';
          
       }
     _renderWorkoutMarker(workout){
        L.marker(workout.coords)
        .addTo(this.#map)
        .bindPopup(L.popup(
            {
            maxWidth: 210,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:`${workout.type}-popup`,
        })
        )
        .setPopupContent('workout')
        .openPopup();

     }
       _renderWorkout(workout){
            

       }
    }
 const app = new App();
 







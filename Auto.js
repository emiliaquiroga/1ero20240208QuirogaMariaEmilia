class Auto extends Vehiculo{
    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos){
        super(id, modelo, anoFabricacion, velMax);
        this.cantidadPuertas = cantidadPuertas;
        this.asientos = asientos;
    }


    toString()
    {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Anio Fabricacion: ${this.anoFabricacion}, velocidad maxima: ${this.velMax}, cantidad de puertas: ${this.cantidadPuertas}, asientos: ${this.asientos}`;
    }
}
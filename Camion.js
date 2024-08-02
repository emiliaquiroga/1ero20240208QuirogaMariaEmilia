class Camion extends Vehiculo{
    constructor(id, modelo, anoFabricacion, velMax, carga, autonomia){
        super(id, modelo, anoFabricacion, velMax);
        this.carga = carga;
        this.autonomia = autonomia;
    }


    toString()
    {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Anio Fabricacion: ${this.anoFabricacion}, velocidad maxima: ${this.velMax}`;
    }
}
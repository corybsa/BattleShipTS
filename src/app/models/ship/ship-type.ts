export class ShipType {
    public name: string;
    public health: number;
    public length: number;

    public static get Destroyer(): ShipType {
        return {
            name: 'Destroyer',
            health: 2,
            length: 2
        };
    };

    public static get Submarine(): ShipType {
        return {
            name: 'Submarine',
            health: 3,
            length: 3
        };
    };

    public static get Cruiser(): ShipType {
        return {
            name: 'Cruiser',
            health: 3,
            length: 3
        };
    };

    public static get Battleship(): ShipType {
        return {
            name: 'Battleship',
            health: 4,
            length: 4
        };
    };

    public static get Carrier(): ShipType {
        return {
            name: 'Carrier',
            health: 5,
            length: 5
        };
    };
}

export interface GameItem {
    name: string // goild coin
    statusEffect: Array<string> // ["burning", "invisable", "camouflaged"]
    hitpoints: number // 17
    size: number // 1 = fully grabbable in 1 hand (doesn't need to be closed, but nothing sticking out)
    weight: number // 1 = kg
    defense: number // 10 = how much the weight / size * 2 * strength needs to be before it starts doing damage
    triggerId: number | null // GI0001 alleen nodig als dit iets triggert, of iets anders dit triggert
}

export interface GameContainer extends GameItem {
    locked: boolean // true
    capacitySize: number // 69
    inventory: GameItem //gold coin on this shelf
}

export interface GameExit {
    locked: boolean // true
    hitpoints: number // 17
    size: number // 1 = fully grabbable in 1 hand (doesn't need to be closed, but nothing sticking out)
    defense: number // 10 = how much the weight / size * 2 * strength needs to be before it starts doing damage
    inventory: GameItem //there is a lock hanging on the door
}
// textPreposition: string //"in", "on", "under" the shelf.
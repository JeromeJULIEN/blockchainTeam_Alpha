export function concatAddress(address : String | undefined ) {
    if(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`  
    }
}
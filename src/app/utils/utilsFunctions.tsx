export function concatAddress(address : String | undefined ) {
    if(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`  
    }
}

export function concatEmail(email: string | undefined): string {
    if(email) {
        const atIndex = email.indexOf('@');
        if (atIndex === -1) {
          throw new Error('Adresse e-mail invalide');
        }
      
        const localPart = email.substring(0, atIndex);
        const domainPart = email.substring(atIndex);
      
        if (localPart.length > 6) {
          return `${localPart.substring(0, 6)}...${domainPart}`;
        }
      
        return email;
    } else {
        return "no email"
    }
  }
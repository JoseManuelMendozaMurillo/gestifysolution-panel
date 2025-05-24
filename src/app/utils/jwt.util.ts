
export function decodeJWT(token: string): {header: any, payload: any} | null {
    try {
        const [headerEncoded, payloadEncoded] = token.split('.');

        const decode = (str: string) => {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            let padding = '';
            if (str.length % 4 === 2) padding = '==';
            else if (str.length % 4 === 3) padding = '=';
            const decoded = atob(str + padding);
            return decodeURIComponent(
                decoded.split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            );
        };

        return {
            header: JSON.parse(decode(headerEncoded)),
            payload: JSON.parse(decode(payloadEncoded))
        };
    } catch (error) {
        console.error("Invalid JWT:", error);
        return null;
    }
}
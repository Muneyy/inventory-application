import he from 'he';

export default function unescapeString (inputString: string) {
    return he.decode(he.decode(inputString));
}
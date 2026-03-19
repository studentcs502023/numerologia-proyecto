// import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();


// const keysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;

// if (!keysString) {
//     throw new Error('No se encontraron GEMINI_API_KEYS en el .env');
// }


// const keys = keysString
//     .split(',')
//     .map(key => key.trim())
//     .filter(key => key.length > 0);

// if (keys.length === 0) {
//     throw new Error('No hay API keys válidas en GEMINI_API_KEYS');
// }


// let currentIndex = 0;

// console.log(`✅ Sistema de rotación de API keys inicializado con ${keys.length} claves`);


// export function getGeminiModel() {
//     const apiKey = keys[currentIndex];
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
//     currentIndex = (currentIndex + 1) % keys.length;
    
//     return model;
// }
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

let currentIndex = 0;

/**
 * Inicializa y limpia las llaves de API desde el entorno
 */
const getKeys = () => {
    const keysString = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;

    if (!keysString) {
        console.error('❌ Error: No se encontraron GEMINI_API_KEYS en el .env');
        return [];
    }

    return keysString
        .split(',')
        .map(key => key.trim())
        .filter(key => key.length > 0);
};

/**
 * Obtiene el modelo de Gemini configurado y listo para usar
 */
export function getGeminiModel() {
    const keys = getKeys();

    if (keys.length === 0) {
        throw new Error('No hay API keys configuradas en el entorno.');
    }

    // Seleccionar la llave actual y rotar para la próxima vez
    const apiKey = keys[currentIndex];
    currentIndex = (currentIndex + 1) % keys.length;

    const genAI = new GoogleGenerativeAI(apiKey);

    /**
     * USAMOS: 'gemini-1.5-flash'
     * Es la versión más estable, rápida y con cuota gratuita amplia.
     */
    return genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        // Añadimos esto para asegurar que use la versión de API correcta
    });
}
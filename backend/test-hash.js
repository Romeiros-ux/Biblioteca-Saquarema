import bcrypt from 'bcryptjs';

const password = 'admin123';
const hashFromDb = '$2a$10$rXzQ8ZJ5oXxqJvKjL6rZl.Z0FjGqxN7vLmCK1Y6xCZ7kKbGpWdY4a';

console.log('Testando hash do banco de dados...');
const isValid = await bcrypt.compare(password, hashFromDb);
console.log('Hash do banco é válido?', isValid);

console.log('\nGerando novo hash...');
const newHash = await bcrypt.hash(password, 10);
console.log('Novo hash:', newHash);

console.log('\nTestando novo hash...');
const isNewValid = await bcrypt.compare(password, newHash);
console.log('Novo hash é válido?', isNewValid);

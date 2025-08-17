const { exec } = require('child_process');

console.log('🌱 Running database seeders...');

exec('npm run seed', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Seeder failed:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Seeder warnings:', stderr);
  }
  
  console.log('✅ Seeder output:', stdout);
  console.log('🎉 Database seeding completed!');
});
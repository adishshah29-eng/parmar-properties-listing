const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env.local';
const envFile = fs.readFileSync(envPath, 'utf8');

let url = '';
let key = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('projects').select('slug, name');
  console.log('Projects:', data);
  console.log('Error:', error);
  
  const { data: project, error: pError } = await supabase
    .from('projects')
    .select(`
      *,
      developer:developers(*),
      images:project_images(*),
      documents:project_documents(*),
      configurations(
        *,
        floorPlans:floor_plans(*)
      )
    `)
    .eq('slug', 'r')
    .single();
    
  console.log('Project Query:', !!project, 'Error:', pError);
}
run();

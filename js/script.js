import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
const supabaseKey = process.env.PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function getVibes (){

}

// d3.json('data/Tree.json').then(function (data) {
//   const tree = new Tree(data);
//   tree.buildTree();
//   tree.renderTree();
// });
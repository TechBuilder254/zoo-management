// Minimal Supabase connectivity test using service role key from environment variables
// Usage (Git Bash/Unix):
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE=... node scripts/test_supabase_connect.js
// Usage (Windows PowerShell):
//   $env:SUPABASE_URL="..."; $env:SUPABASE_SERVICE_ROLE="..."; node scripts/test_supabase_connect.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
	console.error('Missing env vars. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE.');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
	auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

(async () => {
	console.log('Testing Supabase connectivity...');
	console.log(`URL: ${SUPABASE_URL}`);
	console.log(`Key prefix: ${SUPABASE_SERVICE_ROLE.slice(0, 12)}...`);

	try {
		// 1) Simple public table probe (adjusts automatically if table exists)
		const tablesToProbe = ['ticket_prices', 'animals', 'users'];
		for (const table of tablesToProbe) {
			const { error } = await supabase.from(table).select('id', { count: 'exact', head: true }).limit(1);
			if (error) {
				console.log(`- ${table}: ERROR -> ${error.message}`);
			} else {
				console.log(`- ${table}: OK`);
			}
		}

		// 2) Admin scope probe (service role only)
		try {
			const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
			if (error) {
				console.log(`- auth.admin.listUsers: ERROR -> ${error.message}`);
			} else {
				console.log(`- auth.admin.listUsers: OK (found ${data?.users?.length ?? 0} users on first page)`);
			}
		} catch (e) {
			console.log(`- auth.admin.listUsers: ERROR -> ${e.message}`);
		}
	} catch (err) {
		console.error('Connectivity test failed:', err);
		process.exit(1);
	}
})();

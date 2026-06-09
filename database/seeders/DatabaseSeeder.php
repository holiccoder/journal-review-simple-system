<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::create(['name' => 'admin']);

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        $admin->assignRole('admin');

        User::create([
            'name' => 'Student',
            'email' => 'student@student.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
        ]);
    }
}

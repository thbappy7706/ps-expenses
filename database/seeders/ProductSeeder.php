<?php

namespace Database\Seeders;

use App\Jobs\SeedProductsJob;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $totalProducts = 100000; // 1 lakh products
        $batchSize = 1000; // Process 1000 products per job

        $batches = ceil($totalProducts / $batchSize);

        for ($i = 0; $i < $batches; $i++) {
            $remainingProducts = $totalProducts - ($i * $batchSize);
            $currentBatchSize = min($batchSize, $remainingProducts);

            SeedProductsJob::dispatch($currentBatchSize, $i * $batchSize);
        }

        Artisan::call('queue:work --stop-when-empty');
    }
}

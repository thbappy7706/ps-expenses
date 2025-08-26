<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SeedProductsJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $batchSize,
        public int $startIndex
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Product::factory()
            ->count($this->batchSize)
            ->sequence(fn ($sequence) => ['name' => 'Product ' . ($this->startIndex + $sequence->index)])
            ->create();
    }
}

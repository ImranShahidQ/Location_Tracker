<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CheckIn;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckInController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $checkIns = CheckIn::where('user_id', $user->id)
            ->orderBy('check_in_at', 'desc')
            ->get();

        return response()->json($checkIns);
    }
    
    public function checkIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $checkInLocation = $this->reverseGeocode($request->latitude, $request->longitude);

        CheckIn::create([
            'user_id' => Auth::id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'check_in_location' => $checkInLocation,
            'check_in_at' => now(),
        ]);

        return response()->json(['message' => 'Check-in successful'], 200);
    }

    public function checkOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $checkIn = CheckIn::where('user_id', Auth::id())
            ->whereNull('check_out_at')
            ->latest('check_in_at')
            ->first();

        if ($checkIn) {
            $checkOutLocation = $this->reverseGeocode($request->latitude, $request->longitude);

            $checkIn->update([
                'check_out_at' => now(),
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'check_out_location' => $checkOutLocation,
            ]);

            return response()->json(['message' => 'Check-out successful'], 200);
        }

        return response()->json(['message' => 'No active check-in found'], 404);
    }

    private function reverseGeocode($latitude, $longitude)
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Laravel/1.0 (hello@example.com)'
            ])->get('https://nominatim.openstreetmap.org/reverse', [
                'lat' => $latitude,
                'lon' => $longitude,
                'format' => 'json',
                'addressdetails' => 1,
                'accept-language' => 'en',
            ]);

            Log::info('Reverse geocoding API response', ['response' => $response->body()]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Geocoding data', ['data' => $data]);

                $locationName = $data['display_name'] ?? 'Unknown location';

                return $locationName;
            } else {
                Log::error('Reverse geocoding API error', [
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);
                return 'Geocoding error';
            }
        } catch (\Exception $e) {
            Log::error('Reverse geocoding exception', [
                'message' => $e->getMessage(),
            ]);
            return 'Geocoding error';
        }
    }
}

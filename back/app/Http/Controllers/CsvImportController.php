<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserData;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;

class CsvImportController extends Controller
{


    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,txt|max:2048', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $csv = Reader::createFromPath($file->getPathname(), 'r');
        $csv->setHeaderOffset(0);

        foreach ($csv as $record) {
            UserData::create([
                'name' => $record['name'],
                'frist_name' => $record['frist_name'],
                'last_name' => $record['last_name'],
                'phone' => $record['phone'],
                'street' => $record['street'],
                'number_external' => $record['number_external'],
                'number_internal' => $record['number_internal'],
                'district' => $record['district'],
                'cp' => $record['cp'],
                
            ]);
        }

        return response()->json(['message' => 'CSV procesado y datos guardados correctamente'], 200);
    }

    /**
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $usersData = UserData::all();
        return response()->json(['data' => $usersData], 200);
    }

}

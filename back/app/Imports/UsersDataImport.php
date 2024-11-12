<?php

namespace App\Imports;

use App\Models\UserData;
use Maatwebsite\Excel\Concerns\ToModel;

class UsersDataImport implements ToModel
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new UserData([
            'name' => $row['name'],
            'frist_name' => $row['frist_name'],
            'last_name' => $row['last_name'],
            'street' => $row['street'],
            'number_external' => $row['number_external'],
            'number_internal' => $row['number_internal'],
            'district' => $row['district'],
            'cp' => $row['cp'],
        ]);
    }
}

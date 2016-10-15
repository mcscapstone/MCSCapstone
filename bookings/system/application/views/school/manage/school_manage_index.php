<?php
echo $this->session->flashdata('saved');
#if( $this->userauth->CheckAuthLevel( TEACHER ) ){ echo 'teacher'; }
#if( $this->userauth->CheckAuthLevel( ADMINISTRATOR ) ){ echo 'admin'; }


// Menu for all users
$i = 0;
$menu[$i] = [
	'text' => 'Bookings',
	'icon' => 'school_manage_bookings.gif',
	'href' => site_url('bookings')
];

$i++;
$menu[$i] = [
	'text' => 'My Profile',
	'icon' => ($this->userauth->CheckAuthLevel(ADMINISTRATOR, $this->authlevel)) ? 'user_administrator.gif' : 'user_teacher.gif',
	'href' => site_url('profile')
];

$i++;
$menu[$i] = [
	'text' => '',
	'icon' => 'blank.png',
	'href' => ''
];




// Menu items for Administrators

$i = 0;
$school[$i] = [
	'text' => 'Business Details',
	'icon' => 'school_manage_details.gif',
	'href' => site_url('school/details')
];

$i++;
$school[$i] = [
	'text' => 'The Business Day',
	'icon' => 'school_manage_times.gif',
	'href' => site_url('periods')
];

$i++;
$school[$i] = [
	'text' => 'Week Cycle',
	'icon' => 'school_manage_weeks.gif',
	'href' => site_url('weeks')
];

$i++;
$school[$i] = [
	'text' => 'Holidays',
	'icon' => 'school_manage_holidays.gif',
	'href' => site_url('holidays')
];

$i++;
$school[$i] = [
	'text' => 'Rooms',
	'icon' => 'school_manage_rooms.gif',
	'href' => site_url('rooms')
];

$i++;
$school[$i] = [
	'text' => 'Departments',
	'icon' => 'school_manage_departments.gif',
	'href' => site_url('departments')
];


$i = 0;

/*
$i++;
$admin[$i]['text'] = 'Reports';
$admin[$i]['icon'] = 'school_manage_reports.gif';
$admin[$i]['href'] = site_url('reports');
*/

$i++;
$admin[$i] = [
	'text' => 'Users',
	'icon' => 'school_manage_users.gif',
	'href' => site_url('users')
];

$i++;
$admin[$i] = [
	'text' => 'Summary',
	'icon' => 'material/chart-black-x24.svg',
	'href' => site_url("bookings/summary")
];

$i++;
$admin[$i] = [
	'text' => '',
	'icon' => 'blank.png',
	'href' => ''
];

/*$i++;
$admin[$i]['text'] = 'Settings';
$admin[$i]['icon'] = 'school_manage_settings.gif';
$admin[$i]['href'] = site_url('settings');*/



// Start echoing the admin menu
$i = 0;


// Print Normal menu
dotable($menu);



// Check if user is admin
if($this->userauth->CheckAuthLevel(ADMINISTRATOR, $this->authlevel)){
	echo '<h3 class="page-subtitle">Business-related</h3>';
	dotable($school);
	echo '<h3 class="page-subtitle">Management</h3>';
	dotable($admin);
}




function dotable($array){
// <ul id="navlist">
// <li id="active"><a href="#" id="current">Item one</a></li>
// <li><a href="#">Item two</a></li>
// <li><a href="#">Item three</a></li>
// <li><a href="#">Item four</a></li>
// <li><a href="#">Item five</a></li>
// </ul>
	// echo '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	// echo '<tbody>';
	$row = 0;

	foreach($array as $link){
		if($row == 0){ echo '<ul class="dashboard">'; }
		echo '<li>';
		echo '<h5 class="colour-'.$row.'" style="margin:14px 0px">';
		echo '<a href="'.$link['href'].'">';
		echo '<img src="webroot/images/ui/'.$link['icon'].'" alt="'.$link['text'].'" hspace="4" align="top" width="16" height="16" />';
		echo $link['text'];
		echo '</a>';
		echo '</h5>';
		echo '</li>';
		echo "\n";
		if ($row == 2) {
			echo '</tr>'."\n\n"; $row = 0;
		} else {
			$row++;
		}
	}

	// echo '</tbody>';
	// echo '</table>'.
	echo "</ul>\n\n";
}
?>

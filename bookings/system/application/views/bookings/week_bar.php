<script>
	$('body').on('click', '.check-all', function () {
		var targetDay = $(this).attr('id');

		console.log('.day_' + targetDay);

		$('.day_' + targetDay).prop('checked', this.checked);
	});
</script>
<div class="bookings_week" style="<?php echo $style ?>">
	<table width="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>

			<td width="20%" align="left">
				<a href="<?php echo site_url($back_link) ?>" style="<?php echo $style ?>"><?php echo $back_text ?></a>
			</td>

			<td align="center"><?php echo "$longdate - $week_name" ?></td>

			<td width="20%" align="right">
				<a href="<?php echo site_url($next_link) ?>" style="<?php echo $style ?>"><?php echo $next_text ?></a>
			</td>
		</tr>
	</table>
</div>

<br />

import Vue from 'vue';

let vm = new Vue({
	el: '#app',
	data() {
		return {
			title: '学生列表',
			teachers: ['mary', 'john'],
			student: [
				{
					id: 1,
					name: 'aaa',
				},
				{
					id: 2,
					name: 'bbb',
				},
			],
		};
	},
});
// vm.student[0]会返回vm.student,在在数组中[0]
console.log(`vm._data`, vm.student[0]);

var gulp = require("gulp");
var umd = require("gulp-umd");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("umd", function() {
	return gulp.src("src/*")
		.pipe(umd({
			dependencies: function(file) {
				return [
					{
						name: "knockout",
						amd: "knockout",
						cjs: "knockout",
						global: "ko",
						param: "ko"
					},
					{
						name: "jquery",
						amd: "jquery",
						cjs: "jquery",
						global: "jQuery",
						param: "$"
					},
					{
                        name: "bootstrap",
                        amd: "bootstrap",
                        cjs: "bootstrap",
                        global: "jQuery",
                        param: "bootstrap"
                    }
				];
			},
			exports: function(file) {
				return 'Bulktable';
			},
			namespace: function(file) {
				return 'Bulktable';
			}
		}))
		.pipe(gulp.dest("dist"));
});

gulp.task("production", ["umd"], function(){
	return gulp.src("dist/*.js")
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(gulp.dest("dist"))
});

gulp.task("dev", function(){
	return gulp.watch("src/**/*.js", ["umd"]);
});
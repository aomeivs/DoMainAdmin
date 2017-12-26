<template>
    <div>
        <h2>Ecosystem</h2>
        <p>
            {{msg}}
        </p>
        <a href="#">autoprefix.scss</a>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
            msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>

<style lang="scss" scoped>
    h2{
        font-size: 22px;
        display:flex;
        p{
            font-size:16px;
        }
    }
</style>